import { Blog } from '@prisma/client'
import { Link } from 'remix'

export interface BlogCardProps {
  blog: Blog
  isOwner?: boolean
}

export default function BlogCard({ blog, isOwner }: BlogCardProps) {
  return (
    <div
      key={blog.slug}
      className="group border-2 border-solid border-slate-200 mt-4 p-4 rounded-sm transition ease-in-out delay-100 hover:-translate-y-2 duration-300 animate-[slide_2s_ease-in-out] hover:shadow-sm"
    >
      <div className="flex flex-col space-y-4">
        <Link prefetch="intent" className="space-y-4" to={`/blog/${blog.slug}`}>
          <h1 className="text-xl font-bold group-hover:underline">
            {blog.title}
          </h1>
          <p className="text-slate-600">{blog.description}</p>
        </Link>
        {isOwner ? (
          <div className="flex justify-end">
            <Link to={`/blog/edit/${blog.slug}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-zinc-800 hover:text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
