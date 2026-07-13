import { z } from 'zod'

export const componentTypeSchema = z.enum(['benefit-hero', 'coupon-strip', 'product-grid'])

const baseComponentSchema = z.object({
  id: z.string().min(1),
  locked: z.boolean().default(false),
  trackingId: z.string().min(1),
})

export const benefitHeroSchema = baseComponentSchema.extend({
  type: z.literal('benefit-hero'),
  props: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    badge: z.string(),
  }),
})

export const couponStripSchema = baseComponentSchema.extend({
  type: z.literal('coupon-strip'),
  props: z.object({
    label: z.string(),
    amount: z.number().positive(),
    threshold: z.number().nonnegative(),
    memberOnly: z.boolean(),
  }),
})

export const productGridSchema = baseComponentSchema.extend({
  type: z.literal('product-grid'),
  props: z.object({
    title: z.string(),
    strategy: z.enum(['conversion', 'balanced', 'exploration']),
    products: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number().positive(),
        originalPrice: z.number().positive(),
        badge: z.string(),
        color: z.string(),
      }),
    ).min(1),
  }),
})

export const venueComponentSchema = z.discriminatedUnion('type', [
  benefitHeroSchema,
  couponStripSchema,
  productGridSchema,
])

export const pageSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  campaignId: z.string(),
  pageVersionId: z.string(),
  metadata: z.object({
    title: z.string(),
    theme: z.string(),
    audience: z.string(),
    status: z.enum(['draft', 'review', 'gray', 'live']),
  }),
  components: z.array(venueComponentSchema).min(1),
})

export type PageSchema = z.infer<typeof pageSchema>
export type VenueComponent = z.infer<typeof venueComponentSchema>
