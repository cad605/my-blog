import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix'
import type {MetaFunction} from 'remix'

import tailwind from './tailwind.css'
import Nav from './components/Nav'

export function links() {
  return [{rel: 'stylesheet', href: tailwind}]
}

export const meta: MetaFunction = () => {
  const description = `Learn Remix and laugh at the same time!`
  return {
    description,
    keywords: 'Christopher,Donnelly,blog',
    'twitter:image': 'https://remix-jokes.lol/social.png',
    'twitter:card': 'summary_large_image',
    'twitter:creator': '@cdonnelly402',
    'twitter:site': '@cdonnelly402',
    'twitter:title': "Chris Donnelly's Blog",
    'twitter:description': description,
  }
}

function Document({
  children,
  title = `Personal Blog of Chris Donnelly.`,
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
      <body className="bg-bland w-screen h-screen">
        <Nav></Nav>
        <div className="h-max max-w-5xl mx-auto p-12">{children}</div>
        <Scripts />
        <ScrollRestoration />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
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
