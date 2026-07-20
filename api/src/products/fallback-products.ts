import type { Product } from '@prisma/client';

/** Used when Postgres isn't reachable (local dev before Docker/Railway). */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    slug: 'ink-wool-coat',
    name: 'Ink Wool Coat',
    description:
      'A sculptural overcoat in dense Italian wool. Clean lapel, hidden buttons, lined in silk. Built for city winters and late nights.',
    priceCents: 42000,
    category: 'outerwear',
    imageUrl:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80',
    sizes: ['XS', 'S', 'M', 'L'],
    featured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'fallback-2',
    slug: 'glass-silk-blouse',
    name: 'Glass Silk Blouse',
    description:
      'Fluid silk with a soft sheen. Slightly oversized, open cuff, made to tuck or float. Quiet luxury in motion.',
    priceCents: 16800,
    category: 'tops',
    imageUrl:
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1200&q=80',
    sizes: ['XS', 'S', 'M', 'L'],
    featured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'fallback-3',
    slug: 'noir-tailored-trouser',
    name: 'Noir Tailored Trouser',
    description:
      'High-rise wool blend with a sharp crease. Wide leg that still holds structure. Pair with everything.',
    priceCents: 19500,
    category: 'bottoms',
    imageUrl:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'fallback-4',
    slug: 'ember-knit-dress',
    name: 'Ember Knit Dress',
    description:
      'Fine merino column dress with a deep V and long sleeve. Travels light. Looks expensive under a coat.',
    priceCents: 24000,
    category: 'dresses',
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
    sizes: ['XS', 'S', 'M', 'L'],
    featured: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'fallback-5',
    slug: 'slate-leather-bag',
    name: 'Slate Leather Bag',
    description:
      'Vegetable-tanned leather tote with brass hardware. Softens with wear. Fits a laptop and a night out.',
    priceCents: 31000,
    category: 'accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    sizes: ['ONE'],
    featured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'fallback-6',
    slug: 'bone-cotton-tee',
    name: 'Bone Cotton Tee',
    description:
      'Heavyweight organic cotton. Boxy cut, dropped shoulder, finished hem. The tee that replaces five others.',
    priceCents: 7800,
    category: 'tops',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'fallback-7',
    slug: 'midnight-denim',
    name: 'Midnight Denim',
    description:
      'Rigid Japanese denim, indigo so deep it reads black. Straight through the leg. Will fade uniquely yours.',
    priceCents: 22000,
    category: 'bottoms',
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80',
    sizes: ['26', '27', '28', '29', '30', '31', '32'],
    featured: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'fallback-8',
    slug: 'halo-cashmere-scarf',
    name: 'Halo Cashmere Scarf',
    description:
      'Oversize cashmere in soft fog grey. Fringed ends, weightless warmth. The finishing touch.',
    priceCents: 14500,
    category: 'accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80',
    sizes: ['ONE'],
    featured: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
];
