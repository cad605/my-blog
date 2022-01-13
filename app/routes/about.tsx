import {useCatch} from 'remix'

export default function About() {
  return (
    <div className="flex flex-col items-center">
      <article className="items-center prose prose-zinc">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl text-zinc-800 font-bold">
            About
          </h1>
          <p className="text-xl md:text-2xl text-slate-600">
            A bit about me...
          </p>
          <hr className="border-slate-200"></hr>
        </div>
        <div>
          <p>
            Im a full-stack web developer, and over the past few years I've
            worked in a variety of different fields, from commerical real estate
            to accounting, and for a variety of different firms such as Savills,
            KPMG, and NYU.
          </p>
          <p>
            I originally grew up in the suburbs of New York, and I currently
            live in the East Village. I did my undergraduate degree at Boston
            College, where I studied finance and information systems, and
            recently completed my master's degree in computer science from New
            York University.
          </p>
          <p>
            I try to make a lot of stuff, some of which doesn't work, but along
            the way I find I learn some new things. Aside from tinkering with
            the web, more of which can be found on my blog, I love soccer,
            hiking, reading, and traveling (hope to get back to this soon 🥲).
          </p>
        </div>
      </article>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  switch (caught.status) {
    case 404: {
      return (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="font-bold text-4xl text-zinc-800">Sorry!</h1>
          <p className="text-2xl text-slate-600">
            Couldn't find anything here...
          </p>
        </div>
      )
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`)
    }
  }
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="font-bold text-4xl text-zinc-800">Sorry!</h1>
      <p className="text-2xl text-slate-600">
        There was an error loading the About page.
      </p>
    </div>
  )
}
