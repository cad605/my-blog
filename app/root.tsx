import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type {MetaFunction} from 'remix'

import tailwind from './tailwind.css'
import Nav from './components/Nav'

export function links() {
  return [{rel: 'stylesheet', href: tailwind}]
}

export const meta: MetaFunction = () => {
  return {title: 'New Remix App'}
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-bland w-screen h-screen">
        <Nav></Nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}