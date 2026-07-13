import type { z } from 'zod'
import type { productGridSchema } from '../../schema/pageSchema'

type Props = z.infer<typeof productGridSchema>['props']

export function ProductGrid({ title, strategy, products }: Props) {
  return (
    <section className="product-section">
      <div className="section-heading"><div><span>CURATED BY VENUE PILOT</span><h2>{title}</h2></div><em>{strategy}</em></div>
      <div className="product-grid">
        {products.map((product, index) => (
          <article className="product-card" key={product.id}>
            <div className="product-art" style={{ '--product-color': product.color } as React.CSSProperties}>
              <span>{String(index + 1).padStart(2, '0')}</span><div className="bottle" />
            </div>
            <small>{product.badge}</small><h3>{product.name}</h3>
            <div className="price"><strong>¥{product.price}</strong><del>¥{product.originalPrice}</del></div>
          </article>
        ))}
      </div>
    </section>
  )
}
