import {LoaderFunction, ActionFunction, MetaFunction} from 'remix'
import {Link, useLoaderData, useCatch, redirect, useParams} from 'remix'
import type {Blog} from '@prisma/client'
import {db} from '~/utils/db.server'
import invariant from 'tiny-invariant'

type LoaderData = {blog: Blog; html: string}

export const meta: MetaFunction = ({data}: {data: LoaderData | undefined}) => {
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

export const loader: LoaderFunction = async ({request, params}) => {
  invariant(params.slug, 'expected params.slug')
  const slug = params.slug
  const blog = await db.blog.findUnique({
    where: {slug},
  })
  if (!blog) {
    throw new Response(`Oops, didn't find that blog post.`, {
      status: 404,
    })
  }
  return {blog}
}

export const handle = {
  breadcrumb: () => {
    return (
      <Link
        to={`/blog`}
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
        Blog
      </Link>
    )
  },
}

export default function PostSlug() {
  const {blog} = useLoaderData()
  return (
    <div className="flex flex-col items-center">
      <article className="prose prose-zinc">
        <div>
          <h1>{blog.title}</h1>
          <h2 className="text-slate-600">{blog.description}</h2>
          <hr className="border-slate-200"></hr>
        </div>
        <div dangerouslySetInnerHTML={{__html: blog.html}}></div>
      </article>
    </div>
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

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  const {slug} = useParams()

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
