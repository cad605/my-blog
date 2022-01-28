import { useLoaderData, useCatch } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import { Blog } from '@prisma/client'
import { getManyBlogs } from '~/utils/blog.server'
import ArrowButton from '~/components/arrow-button'
import BlogCard from '~/components/blog-card'
import Grid from '~/components/grid'
import { ServerError, MissingPage } from '~/components/errors'

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
          I like to write about programming, the web, and other things I'm
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
        <Grid>
          {blogs.length
            ? blogs.map((blog, i) => (
                <BlogCard
                  key={blog.slug}
                  blog={blog}
                  isOwner={false}
                ></BlogCard>
              ))
            : null}
        </Grid>
      </section>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ServerError error={error} />
}

export function CatchBoundary() {
  const caught = useCatch()
  console.error('CatchBoundary', caught)
  return <MissingPage />
}
