import { renderVenueComponent } from './venue/registry'
import type { PageSchema } from '../schema/pageSchema'

export function VenuePreview({ venue }: { venue: PageSchema }) {
  return <main className="venue-canvas">{venue.components.map((component) => <div key={component.id}>{renderVenueComponent(component)}</div>)}</main>
}
