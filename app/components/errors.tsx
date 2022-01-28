import { useMatches } from 'remix'
import * as React from 'react'

type ErrorPageProps = {
  error?: Error
  title: string
  subtitle: string
}

function ErrorPage({ error, ...props }: ErrorPageProps) {
  return (
    <>
      <noscript>
        <div
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: 30,
          }}
        >
          <h1 style={{ fontSize: '2em' }}>{props.title}</h1>
          <p style={{ fontSize: '1.5em' }}>{props.subtitle}</p>
          <small>
            Also, this site works much better with JavaScript enabled...
          </small>
        </div>
      </noscript>
      <main className="relative">
        {error && process.env.NODE_ENV === 'development' ? (
          <pre>{error}</pre>
        ) : null}
      </main>
    </>
  )
}

function MissingPage() {
  const matches = useMatches()
  const last = matches[matches.length - 1]
  const pathname = last?.pathname

  return (
    <ErrorPage
      title={"404 - Oh no, you found a page that's missing stuff."}
      subtitle={`"${pathname}" is not a page on christopherdonnelly.xyz. Sorry!`}
    />
  )
}

function ServerError({ error }: { error?: Error }) {
  const matches = useMatches()
  const last = matches[matches.length - 1]
  const pathname = last?.pathname

  return (
    <ErrorPage
      error={error}
      title={'500 - Oh no, something did not go well.'}
      subtitle={`"${pathname}" is currently not working. So sorry.`}
    />
  )
}

export { ServerError, ErrorPage, MissingPage }
