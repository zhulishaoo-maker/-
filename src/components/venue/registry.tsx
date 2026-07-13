import type { VenueComponent } from '../../schema/pageSchema'
import { BenefitHero } from './BenefitHero'
import { CouponStrip } from './CouponStrip'
import { ProductGrid } from './ProductGrid'

export const componentRegistry = {
  'benefit-hero': { label: '权益头图', risk: 'high' },
  'coupon-strip': { label: '优惠券', risk: 'high' },
  'product-grid': { label: '商品网格', risk: 'low' },
} as const

export function renderVenueComponent(component: VenueComponent) {
  switch (component.type) {
    case 'benefit-hero': return <BenefitHero {...component.props} />
    case 'coupon-strip': return <CouponStrip {...component.props} />
    case 'product-grid': return <ProductGrid {...component.props} />
  }
}
