import type { PageSchema } from '../schema/pageSchema'

export const sampleVenue: PageSchema = {
  schemaVersion: '1.0.0',
  campaignId: 'camp-summer-beauty',
  pageVersionId: 'pv-summer-003',
  metadata: {
    title: '夏日美妆狂欢',
    theme: '防晒 · 控油 · 轻盈夏日',
    audience: '近 30 日美妆活跃用户',
    status: 'review',
  },
  components: [
    {
      id: 'hero-01',
      type: 'benefit-hero',
      locked: true,
      trackingId: 'summer.hero',
      props: {
        eyebrow: 'SUMMER BEAUTY EDIT',
        title: '热浪来了\n妆容不能化',
        subtitle: '防晒・控油・轻盈底妆',
        badge: '满 300 减 50',
      },
    },
    {
      id: 'coupon-01',
      type: 'coupon-strip',
      locked: true,
      trackingId: 'summer.coupon.member',
      props: { label: '会员专享加码券', amount: 20, threshold: 199, memberOnly: true },
    },
    {
      id: 'grid-01',
      type: 'product-grid',
      locked: false,
      trackingId: 'summer.grid.sunscreen',
      props: {
        title: '高温实验室',
        strategy: 'balanced',
        products: [
          { id: 'p1', name: '轻透水感防晒乳', price: 129, originalPrice: 169, badge: '热卖 TOP 1', color: '#f4d172' },
          { id: 'p2', name: '零感控油妆前乳', price: 89, originalPrice: 119, badge: '回购率 42%', color: '#d8e7c2' },
          { id: 'p3', name: '持妆柔焦气垫', price: 159, originalPrice: 199, badge: '新客首选', color: '#e8c3b8' },
          { id: 'p4', name: '冰感定妆喷雾', price: 69, originalPrice: 99, badge: '加购率 +18%', color: '#bedde2' },
        ],
      },
    },
  ],
}
