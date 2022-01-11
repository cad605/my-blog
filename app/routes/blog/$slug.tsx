import type {LoaderFunction, ActionFunction, MetaFunction} from 'remix'
import {Link, useLoaderData, useCatch, redirect, useParams} from 'remix'
import type {Blog} from '@prisma/client'
import {db} from '~/utils/db.server'
import invariant from 'tiny-invariant'
import fm from 'front-matter'
import {marked} from 'marked'

type LoaderData = {blog: Blog; html: string}

// export const meta: MetaFunction = ({data}: {data: LoaderData | undefined}) => {
//   if (!data) {
//     return {
//       title: 'No blog',
//       description: 'No blog found',
//     }
//   }
//   return {
//     title: `"${data.blog.title}"`,
//     description: `Enjoy the post about"${data.blog.title}" and much more`,
//   }
// }
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

  const {body} = fm(blog.markdown)
  const html = marked(body)
  return {...blog, html}
}

export default function PostSlug() {
  const blog = useLoaderData()
  return (
    <article className="mt-6 mx-auto prose prose-slate">
      <h1>{blog.title}</h1>
      <p>{blog.description}</p>
      <hr></hr>
      <div dangerouslySetInnerHTML={{__html: blog.html}}></div>
    </article>
  )
}
