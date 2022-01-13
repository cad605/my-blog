import type {LoaderFunction, MetaFunction} from 'remix'
import {Link, useLoaderData, useCatch} from 'remix'
import {Blog, User} from '@prisma/client'
import {db} from '~/utils/db.server'
import {getUserId} from '~/utils/session.server'

type LoaderData = {
  blogListItems: Array<Blog>
  isOwner: boolean
}

export const meta: MetaFunction = ({data}: {data: LoaderData | undefined}) => {
  return {
    title: `Chris Donnelly | Blog`,
    description: `Enjoy the blog!`,
  }
}

export const loader: LoaderFunction = async ({request, params}) => {
  const userId = await getUserId(request)

  const data: LoaderData = {
    blogListItems: await db.blog.findMany({
      orderBy: [{updatedAt: 'desc'}],
    }),
    isOwner: userId ? true : false,
  }
  return data
}

export default function BlogIndexRoute() {
  const {blogListItems, isOwner} = useLoaderData<LoaderData>()

  return (
    <main>
      <div className="md:relative mb-4 sm:flex sm:flex-col space-y-4">
        <h1 className="text-zinc-800 text-4xl font-bold animate-[slide_1s_ease-in-out]">
          Blog
        </h1>
        <p className="text-slate-600 animate-[slide_1.5s_ease-in-out]">
          Ideas about programming and the web, amongst other things.
        </p>
        {isOwner ? (
          <button className="md:absolute md:bottom-0 md:right-0 transfrom hover:-translate-y-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-base font-medium text-white bg-zinc-800 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 focus:bg-slate-600 animate-[slide_1.5s_ease-in-out]">
            <Link className="text-white font-base" to="/blog/new">
              New Post
            </Link>
          </button>
        ) : null}
      </div>
      <section>
        <div className="grid md:grid-cols-2 gap-4">
          {blogListItems.map((blog, i) => (
            <div
              key={blog.slug}
              className="group border-2 border-solid border-slate-200 mt-4 p-4 rounded-sm transition ease-in-out delay-100 hover:-translate-y-2 duration-300 animate-[slide_2s_ease-in-out] hover:shadow-sm"
            >
              <Link
                prefetch="intent"
                to={`/blog/${blog.slug}`}
                className="space-y-4"
              >
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
