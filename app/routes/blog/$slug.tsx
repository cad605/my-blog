import type { LoaderFunction, MetaFunction } from 'remix'
import { useLoaderData, useCatch, useParams } from 'remix'
import type { Blog } from '@prisma/client'
import invariant from 'tiny-invariant'
import ArrowButton from '~/components/arrow-button'
import { getBlogBySlug } from '~/utils/blog.server'

type LoaderData = { blog: Blog }

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined
}) => {
  if (!data) {
    return {
      title: 'No blog',
      description: 'No blog found',
    }
  }

  return {
    title: `Christopher Donnelly | ${data.blog.title}`,
    description: `${data.blog.description}!`,
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug')
  const slug = params.slug

  const blog = await getBlogBySlug({
    where: { slug },
  })

  return { blog }
}

export const handle = {
  breadcrumb: () => {
    return (
      <ArrowButton direction="left" href="/blog">
        Blog
      </ArrowButton>
    )
  },
}

export default function PostSlug() {
  const { blog } = useLoaderData<LoaderData>()
  return (
    <section>
      <article className="max-w-xs sm:max-w-prose prose prose-zinc prose-sm md:prose-base lg:prose-lg">
        <h1 id="top">{blog.title}</h1>
        <h2 className="text-slate-600">{blog.description}</h2>
        <hr className="border-slate-200"></hr>
        <div dangerouslySetInnerHTML={{ __html: blog.html }}></div>
      </article>
      <ArrowButton href="#top" direction="up">
        Back to Top
      </ArrowButton>
    </section>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  const params = useParams()
  switch (caught.status) {
    case 404: {
      return (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="font-bold text-4xl text-zinc-800">Sorry!</h1>
          <p className="text-2xl text-slate-600">
            Couldn't find a blog post at{' '}
            <span className="font-bold underline"> blog/{params.slug}</span>.
          </p>
        </div>
      )
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`)
    }
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)
  const { slug } = useParams()

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="font-bold text-4xl text-zinc-800">Sorry!</h1>
      <p className="text-2xl text-slate-600">
        There was an error loading the blog post at
        <span className="font-bold underline"> blog/{slug}</span>.
      </p>
    </div>
  )
}
