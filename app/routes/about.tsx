import {Link, useCatch} from 'remix'

export const handle = {
  breadcrumb: () => (
    <Link
      to={`/`}
      className="text-zinc-800 font-medium group hover:underline animate-[slide_1s_ease-in-out]"
    >
      {' '}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        width="16"
        height="16"
        className="inline-block group-hover:-translate-x-1 transition duration-300"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
      Home
    </Link>
  ),
}

export default function About() {
  return (
    <div className="flex flex-col items-center">
      <article className="items-center prose prose-zinc">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl">About</h1>
          <p className="text-xl md:text-2xl text-slate-600">
            A bit of context...
          </p>
          <hr className="border-slate-200"></hr>
        </div>
        <div>
          <p>
            I'm a full-stack software engineer, and over the past few years I've
            worked in a variety of different fields, from commerical real estate
            to accounting, and for a variety of different firms such as Savills,
            KPMG, and NYU.
          </p>
          <p>
            I originally grew up in the suburbs of New York, and I currently
            live in the East Village. I spent three years doing my undergraduate
            degree at Boston College, where I studied finance and information
            systems, and I recently completed my master's degree in computer
            science from New York University.
          </p>
          <p>
            On this site, I write about technology that I'm learning about or
            just find interesting. Aside from tinkering with computers, I love
            soccer, hiking, reading, and traveling (which I hope to be able to
            do again soon 🥲). Thanks for checking out my site!
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
