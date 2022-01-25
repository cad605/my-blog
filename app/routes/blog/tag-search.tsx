import type { LoaderFunction } from 'remix'
import { json } from 'remix'
import { getTags } from '~/utils/tags.server'

export const loader: LoaderFunction = async ({ request }) => {
  // First get what the user is searching for by creating a URL:
  // https://developer.mozilla.org/en-US/docs/Web/API/URL
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
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
    // Add a little bit of caching so when the user backspaces a value in the
    // Combobox, the browser has a local copy of the data and doesn't make a
    // request to the server for it. No need to send a client side data fetching
    // library that caches results in memory, the browser has this ability
    // built-in.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
    headers: { 'Cache-Control': 'max-age=60' },
  })
}
