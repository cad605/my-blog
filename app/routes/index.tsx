import type {LoaderFunction, MetaFunction} from 'remix'
import {Link, useLoaderData} from 'remix'
import {Blog} from '@prisma/client'
import {db} from '~/utils/db.server'

type LoaderData = {
  blogListItems: Array<Blog>
}

export const meta: MetaFunction = ({data}: {data: LoaderData | undefined}) => {
  return {
    title: `Chris Donnelly | Home`,
    description: `Chris Donnelly's Personal Website`,
  }
}

export const loader: LoaderFunction = async ({params}) => {
  const data: LoaderData = {
    blogListItems: await db.blog.findMany({
      take: 4,
      orderBy: [{updatedAt: 'desc'}],
    }),
  }
  return data
}

export default function Index() {
  const {blogListItems} = useLoaderData<LoaderData>()

  return (
    <div className="flex flex-col">
      <section className="mb-12">
        <h1 className="text-4xl md:text-6xl text-zinc-800 font-bold mb-6 animate-[slide_1s_ease-in-out]">
          Hey there, I'm <span className="underline">Chris</span>.
        </h1>
        <div className="text-3xl md:text-5xl text-slate-600 mb-6 animate-[slide_1.5s_ease-in-out]">
          I'm a software engineer living in New York.
        </div>
        <div className="text-3xl md:text-5xl text-slate-600 animate-[slide_2s_ease-in-out]">
          I often write about programming, the web, and other things I'm
          learning about.
        </div>
      </section>
      <section className="animate-[slide_2.5s_ease-in-out]">
        <div className="space-y-4">
          <Link
            to="/blog"
            className="text-2xl md:text-3xl text-zinc-800 font-bold group hover:underline"
          >
            Blog
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="18"
              height="18"
              className="inline-block group-hover:translate-x-2 transition duration-300"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
          <p className="text-slate-600">Some recent thoughts</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-content-center mt-2">
          {blogListItems.map(blog => (
            <div
              key={blog.slug}
              className="group border-2 border-solid border-slate-200 mt-4 p-4 rounded-sm transition ease-in-out delay-100 hover:-translate-y-2 duration-300 hover:shadow-sm"
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
    </div>
  )
}
