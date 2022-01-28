import type { LoaderFunction } from 'remix'
import { json } from 'remix'
import { getTags } from '~/utils/tags.server'

// TODO: resource route for blog tags
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')

  const tags = await getTags({
    where: {
      name: {
        contains: `${query}`,
      },
    },
  })

  return json(tags, {
    headers: { 'Cache-Control': 'max-age=60' },
  })
}
