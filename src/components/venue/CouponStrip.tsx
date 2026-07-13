import { TicketCheck } from 'lucide-react'
import type { z } from 'zod'
import type { couponStripSchema } from '../../schema/pageSchema'

type Props = z.infer<typeof couponStripSchema>['props']

export function CouponStrip({ label, amount, threshold, memberOnly }: Props) {
  return (
    <section className="coupon-strip">
      <TicketCheck size={17} />
      <div><small>{memberOnly ? 'MEMBERS ONLY' : 'LIMITED COUPON'}</small><strong>{label}</strong></div>
      <span><b>¥{amount}</b> 满 {threshold} 可用</span>
    </section>
  )
}
