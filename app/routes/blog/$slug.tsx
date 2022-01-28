import { useLoaderData, useCatch, useParams } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import type { Blog } from '@prisma/client'
import invariant from 'tiny-invariant'
import ArrowButton from '~/components/arrow-button'
import { getBlogBySlug } from '~/utils/blog.server'
import { ServerError, MissingPage } from '~/components/errors'

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

export function ErrorBoundary({ error }: { error: Error }) {
  return <ServerError error={error} />
}

export function CatchBoundary() {
  const caught = useCatch()
  console.error('CatchBoundary', caught)
  return <MissingPage />
}
