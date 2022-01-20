import {Link, useCatch} from 'remix'
import type {MetaFunction} from 'remix'
import ArrowButton from '~/components/ArrowButton'

export const meta: MetaFunction = () => {
  return {
    title: `Christopher Donnelly | About`,
    description: `About Christopher Donnelly`,
  }
}

export const handle = {
  breadcrumb: () => {
    return (
      <ArrowButton direction="left" href="/">
        Home
      </ArrowButton>
    )
  },
}

export default function About() {
  return (
    <article className="max-w-xs sm:max-w-prose prose prose-zinc prose-sm md:prose-base lg:prose-lg">
      <h1>About</h1>
      <h2 className="text-slate-600">A bit of context...</h2>
      <hr className="border-slate-200"></hr>
      <div>
        <p>
          I'm a full-stack software engineer, and over the past few years I've
          worked in a variety of different fields, from commerical real estate
          to accounting, and have helped build digital products for a variety of
          different firms such as Savills, KPMG, and NYU.
        </p>
        <p>
          I originally grew up in the suburbs of New York, and I currently live
          in the East Village. I spent three years completing my undergraduate
          degree at Boston College, where I studied finance and information
          systems, and I recently received my master's degree in computer
          science from New York University.
        </p>
        <p>
          On this site, I write about technology that I'm learning about or just
          find interesting. Aside from tinkering with computers, I love soccer,
          hiking, reading, and traveling (which I hope to be able to do again
          soon 🥲).
        </p>
        <p>
          While I don't maintain a large social media presence, if you do wish
          to contact me, you can find my social profiles in the footer below.
          Thanks for checking out my site!
        </p>
      </div>
    </article>
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
