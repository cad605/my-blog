import { Link, useLoaderData, useCatch } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import { Blog } from '@prisma/client'
import { getUserId } from '~/utils/session.server'
import ArrowButton from '~/components/arrow-button'
import { getManyBlogs } from '~/utils/blog.server'
import BlogCard from '~/components/blog-card'
import Grid from '~/components/grid'
import { ServerError, MissingPage } from '~/components/errors'

type LoaderData = {
  blogs: Array<Blog>
  isOwner: boolean
}

export const meta: MetaFunction = () => {
  return {
    title: `Christopher Donnelly | Blog`,
    description: `Personal blog of Christopher Donnelly`,
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const data: LoaderData = {
    blogs: await getManyBlogs({
      include: { user: true },
      orderBy: [{ updatedAt: 'desc' }],
    }),
    isOwner: (await getUserId(request)) ? true : false,
  }
  return data
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

export default function BlogIndexRoute() {
  const { blogs, isOwner } = useLoaderData<LoaderData>()

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
        <Grid>
          {blogs.length
            ? blogs.map((blog, i) => (
                <BlogCard
                  key={blog.slug}
                  blog={blog}
                  isOwner={isOwner}
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
