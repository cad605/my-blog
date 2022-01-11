import type {LoaderFunction} from 'remix'
import {Link, useLoaderData} from 'remix'
import {Blog} from '@prisma/client'
import {db} from '~/utils/db.server'

type LoaderData = {
  blogListItems: Array<Blog>
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
        <h1 className="text-zinc-800 text-4xl font-bold">Blog</h1>
        <p className="text-slate-600">
          Ideas about the programming, the web, and other things.
        </p>
      </div>
      <section>
        <div className="grid">
          {blogListItems.map(blog => (
            <div
              key={blog.slug}
              className="group border-2 border-solid border-slate-200 mt-4 p-4 rounded-sm transition ease-in-out delay-100 hover:-translate-y-2 duration-300"
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
