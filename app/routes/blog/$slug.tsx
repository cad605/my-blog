import type {LoaderFunction, ActionFunction, MetaFunction} from 'remix'
import {Link, useLoaderData, useCatch, redirect, useParams} from 'remix'
import type {Blog} from '@prisma/client'
import {db} from '~/utils/db.server'
import invariant from 'tiny-invariant'
import fm from 'front-matter'
import {marked} from 'marked'

type LoaderData = {blog: Blog; html: string}

export const meta: MetaFunction = ({data}: {data: LoaderData | undefined}) => {
  if (!data) {
    return {
      title: 'No blog',
      description: 'No blog found',
    }
  }

  return {
    title: `Chris Donnelly | ${data.blog.title}`,
    description: `Enjoy the post about ${data.blog.title}!`,
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

  const {attributes, body} = fm(blog.markdown)
  const html = marked(body)
  return {blog, html}
}

export default function PostSlug() {
  const {blog, html} = useLoaderData()
  return (
    <div className="grid grid-cols-12">
      <div className="col-start-1 col-span-12 space-y-4">
        <h1 className="text-6xl md:text-8xl text-zinc-800 font-bold">
          {blog.title}
        </h1>
        <p className="text-4xl md:text-6xl text-slate-600">
          {blog.description}
        </p>
        <hr className="border-slate-200"></hr>
      </div>
      <article className="col-start-1 col-span-12 prose prose-zinc">
        <div dangerouslySetInnerHTML={{__html: html}}></div>
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
