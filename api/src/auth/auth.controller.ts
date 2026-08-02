import {
  Body,
  Controller,
  Get,
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

  private cookieValue(role: 'site' | 'office') {
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const raw = `${role}.${exp}`;
    return `${raw}.${this.sign(raw)}`;
  }

  private readRole(req: Request): 'site' | 'office' | null {
    const token = req.cookies?.cf_session as string | undefined;
    if (!token) return null;
    const [role, exp, sig] = token.split('.');
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

  @Get('me')
  me(@Req() req: Request) {
    const role = this.readRole(req);
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
    const site = (process.env.SITE_PASSWORD ?? '').trim().replace(/^["']|["']$/g, '');
    const office = (process.env.OFFICE_PASSWORD ?? '')
      .trim()
      .replace(/^["']|["']$/g, '');

    let role: 'site' | 'office' | null = null;
    if (office && password === office) role = 'office';
    else if (site && password === site) role = 'site';

    if (!role) throw new UnauthorizedException('Incorrect password');

    // Cross-subdomain Railway (web + api) needs SameSite=None; Secure
    const crossSite = Boolean(process.env.CORS_ORIGIN?.startsWith('https://'));
    res.cookie('cf_session', this.cookieValue(role), {
      httpOnly: true,
      sameSite: crossSite ? 'none' : 'lax',
      secure: crossSite || process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { ok: true, office: role === 'office' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('cf_session');
    return { ok: true };
  }
}
