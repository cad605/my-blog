import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useMatches,
} from 'remix'
import type {MetaFunction} from 'remix'

import tailwind from './tailwind.css'
import Nav from './components/Nav'

export function links() {
  return [{rel: 'stylesheet', href: tailwind}]
}

export const meta: MetaFunction = () => {
  const description = `I write about programming, the web, and other topics I'm learning about`
  return {
    description,
    keywords: 'Christopher,Donnelly,blog',
    'twitter:image': 'https://remix-jokes.lol/social.png',
    'twitter:card': 'summary_large_image',
    'twitter:creator': '@cdonnelly402',
    'twitter:site': '@cdonnelly402',
    'twitter:title': "Chris Donnelly's Personal Website",
    'twitter:description': description,
  }
}

function Document({
  children,
  title = `Chris Donnelly`,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="flex flex-col w-screen h-screen bg-bland">
        <header className="flex-none">
          <Nav></Nav>
        </header>
        <main className="grow max-w-5xl mx-auto p-12">{children}</main>
        <footer className="flex-none border border-t-2 h-40">
          <div></div>
        </footer>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

export default function App() {
  const matches = useMatches()

  return (
    <Document>
      <ol className="mb-6 animate-[slide_0.75s_ease-in-out]">
        {matches
          // skip routes that don't have a breadcrumb
          .filter(match => match.handle && match.handle.breadcrumb)
          // render breadcrumbs!
          .map((match, index) => (
            <li key={index}>{match.handle.breadcrumb(match)}</li>
          ))}
      </ol>
      <Outlet />
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)

  return (
    <Document title="Uh-oh!">
      <div>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  )
}
