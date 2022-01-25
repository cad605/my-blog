import { Blog, Prisma } from '@prisma/client'
import { redirect } from 'remix'
import { db } from './db.server'

export async function getManyBlogs(
  query: Prisma.BlogFindManyArgs,
): Promise<Blog[]> {
  const blogs: Blog[] = await db.blog.findMany(query)

  if (!blogs) {
    throw new Response(`Oops, had an issue getting the blog posts.`, {
      status: 404,
    })
  }

  return blogs
}

export async function getBlogBySlug(
  query: Prisma.BlogFindUniqueArgs,
): Promise<Blog> {
  const blog: Blog | null = await db.blog.findUnique(query)

  if (!blog) {
    throw new Response(`Oops, didn't find that blog post.`, {
      status: 404,
    })
  }

  return blog
}

export async function createNewBlog(
  query: Prisma.BlogCreateArgs,
): Promise<Response> {
  const blog = await db.blog.create(query)
  return redirect(`/blog/${blog.slug}`)
}

export async function updateBlog(
  query: Prisma.BlogUpdateArgs,
): Promise<Response> {
  const blog = await db.blog.update(query)
  return redirect(`/blog/${blog.slug}`)
}
