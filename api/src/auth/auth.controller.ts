import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';

@Controller('auth')
export class AuthController {
  private sign(payload: string) {
    const secret = process.env.SESSION_SECRET ?? 'dev-secret';
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  private makeToken(role: 'site' | 'office') {
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const raw = `${role}.${exp}`;
    return `${raw}.${this.sign(raw)}`;
  }

  private parseToken(token?: string | null): 'site' | 'office' | null {
    if (!token) return null;
    const value = token.startsWith('Bearer ') ? token.slice(7) : token;
    const [role, exp, sig] = value.split('.');
    if (!role || !exp || !sig) return null;
    const raw = `${role}.${exp}`;
    const expected = this.sign(raw);
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    } catch {
      return null;
    }
    if (Number(exp) < Date.now()) return null;
    if (role !== 'site' && role !== 'office') return null;
    return role;
  }

  private readRole(
    req: Request,
    authorization?: string,
  ): 'site' | 'office' | null {
    return (
      this.parseToken(authorization) ??
      this.parseToken(req.cookies?.cf_session as string | undefined)
    );
  }

  @Get('me')
  me(
    @Req() req: Request,
    @Headers('authorization') authorization?: string,
  ) {
    const role = this.readRole(req, authorization);
    return {
      authenticated: Boolean(role),
      office: role === 'office',
    };
  }

  @Post('login')
  login(
    @Body() body: { password?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const password = (body.password ?? '').trim();
    const site = (process.env.SITE_PASSWORD ?? '')
      .trim()
      .replace(/^["']|["']$/g, '');
    const office = (process.env.OFFICE_PASSWORD ?? '')
      .trim()
      .replace(/^["']|["']$/g, '');

    let role: 'site' | 'office' | null = null;
    if (office && password === office) role = 'office';
    else if (site && password === site) role = 'site';

    if (!role) throw new UnauthorizedException('Incorrect password');

    const token = this.makeToken(role);

    // Keep cookie for same-origin/local; token is what Railway browsers use
    const crossSite = Boolean(process.env.CORS_ORIGIN?.startsWith('https://'));
    res.cookie('cf_session', token, {
      httpOnly: true,
      sameSite: crossSite ? 'none' : 'lax',
      secure: crossSite || process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { ok: true, office: role === 'office', token };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('cf_session');
    return { ok: true };
  }
}
