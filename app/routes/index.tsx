import type { LoaderFunction, MetaFunction } from 'remix'
import { Link, useLoaderData } from 'remix'
import { Blog } from '@prisma/client'
import ArrowButton from '~/components/arrow-button'
import { getManyBlogs } from '~/utils/blog.server'

type LoaderData = {
  blogs: Array<Blog>
}

export const meta: MetaFunction = () => {
  return {
    title: `Christopher Donnelly | Home`,
    description: `Christopher Donnelly's Personal Website`,
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const data: LoaderData = {
    blogs: await getManyBlogs({
      take: 2,
      orderBy: [{ updatedAt: 'desc' }],
    }),
  }
  return data
}

export default function Index() {
  const { blogs } = useLoaderData<LoaderData>()

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
        <div className="space-y-2">
          <ArrowButton direction="right" href="/blog">
            <span className="text-2xl md:text-3xl font-bold">Blog</span>
          </ArrowButton>
          <p className="text-slate-600">Some recent thoughts</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-content-center mt-2">
          {blogs.map(blog => (
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
