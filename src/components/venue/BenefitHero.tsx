import type { z } from 'zod'
import type { benefitHeroSchema } from '../../schema/pageSchema'

type Props = z.infer<typeof benefitHeroSchema>['props']

export function BenefitHero({ eyebrow, title, subtitle, badge }: Props) {
  return (
    <section className="venue-hero">
      <span className="venue-hero__eyebrow">{eyebrow}</span>
      <div className="sun-orbit" aria-hidden="true"><span /></div>
      <h1>{title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
      <p>{subtitle}</p>
      <strong className="benefit-stamp">{badge}</strong>
    </section>
  )
}
