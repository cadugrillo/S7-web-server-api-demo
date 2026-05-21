import { ExternalLink } from 'lucide-react'
import { resources } from '@/data/resources'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Group resources by category, preserving insertion order
function groupByCategory(items: typeof resources) {
  return items.reduce<Record<string, typeof resources>>((acc, item) => {
    ;(acc[item.category] ??= []).push(item)
    return acc
  }, {})
}

export default function ResourcesPage() {
  const groups = groupByCategory(resources)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Resources</h2>
        <p className="text-sm text-muted-foreground">
          Documentation, references, and useful links for this demo.
        </p>
      </div>

      {Object.entries(groups).map(([category, items]) => (
        <section key={category} className="space-y-3">
          <Badge variant="secondary" className="text-xs uppercase tracking-wide px-3 py-1">
            {category}
          </Badge>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {items.map(({ description, url }) => (
              <Card
                key={url}
                className="flex flex-col justify-between gap-4 p-4 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-0 text-sm text-foreground leading-relaxed">
                  {description}
                </CardContent>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline truncate"
                >
                  <ExternalLink className="size-3 shrink-0" />
                  {url.replace(/^https?:\/\//, '')}
                </a>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
