import type {LoaderFunction, MetaFunction} from 'remix'
import {Link, useLoaderData, useCatch} from 'remix'
import {Blog} from '@prisma/client'
import {db} from '~/utils/db.server'

type LoaderData = {
  blogListItems: Array<Blog>
}

export const meta: MetaFunction = ({data}: {data: LoaderData | undefined}) => {
  return {
    title: `Chris Donnelly | Blog`,
    description: `Enjoy the blog!`,
  }
}

export const loader: LoaderFunction = async ({params}) => {
  const data: LoaderData = {blogListItems: await db.blog.findMany()}
  return data
}

export default function BlogIndexRoute() {
  const {blogListItems} = useLoaderData<LoaderData>()

  return (
    <main>
      <div className="mb-4">
        <h1 className="text-zinc-800 text-4xl font-bold animate-[slide_1s_ease-in-out]">
          Blog
        </h1>
        <p className="text-slate-600 animate-[slide_1.5s_ease-in-out]">
          Ideas about programming, the web, and other things.
        </p>
      </div>
      <section>
        <div className="grid md:grid-cols-2 gap-4">
          {blogListItems.map((blog, i) => (
            <div
              key={blog.slug}
              className="group border-2 border-solid border-slate-200 mt-4 p-4 rounded-sm transition ease-in-out delay-100 hover:-translate-y-2 duration-300 animate-[slide_2s_ease-in-out]"
            >
              <Link prefetch="intent" to={`/blog/${blog.slug}`} className="">
                <h1 className="text-xl font-bold group-hover:underline">
                  {blog.title}
                </h1>
                <p className="text-slate-600">{blog.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
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
        There was an error loading the blog posts.
      </p>
    </div>
  )
}
