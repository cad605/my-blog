import {LoaderFunction, MetaFunction, useMatches} from 'remix'
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
    title: `Christopher Donnelly | Blog`,
    description: `Personal blog of Christopher Donnelly`,
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

export default function BlogIndexRoute() {
  const matches = useMatches()
  const {blogListItems, isOwner} = useLoaderData<LoaderData>()

  return (
    <div>
      <section className="mb-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-zinc-800 text-4xl font-bold animate-[slide_1s_ease-in-out]">
            Blog
          </h1>
          <p className="text-slate-600 animate-[slide_1.5s_ease-in-out]">
            Ideas about programming and the web, amongst other things.
          </p>
          <hr className="border-slate-200"></hr>
          {isOwner ? (
            <div className="flex justify-end">
              <Link
                className="md:flex-none grow font-base transfrom hover:-translate-y-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-base font-medium text-white bg-zinc-800 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 focus:bg-slate-600 animate-[slide_1.5s_ease-in-out]"
                to="/blog/new"
              >
                New Post
              </Link>
            </div>
          ) : null}
        </div>
      </section>
      <section>
        <div className="grid md:grid-cols-2 gap-4">
          {blogListItems.map((blog, i) => (
            <div
              key={blog.slug}
              className="group border-2 border-solid border-slate-200 mt-4 p-4 rounded-sm transition ease-in-out delay-100 hover:-translate-y-2 duration-300 animate-[slide_2s_ease-in-out] hover:shadow-sm"
            >
              <div className="flex flex-col space-y-4">
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
                {isOwner ? (
                  <div className="flex justify-end">
                    <Link to={`/blog/edit/${blog.slug}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-zinc-800 hover:text-slate-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
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
        There was an error loading the blog posts.
      </p>
    </div>
  )
}
