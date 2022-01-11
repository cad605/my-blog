import {Link, useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'
import {Blog} from '@prisma/client'
import {db} from '~/utils/db.server'

export const loader: LoaderFunction = () => {
  return [
    {
      slug: 1,
      title: 'My First Post',
      description: 'My first post on my new website!',
      markdown: `
      ---title: Twitter Clone with Raft---
      # Raft: Simple Twitter Clone"
      This is a simple Twitter clone that implements its distributed SQLite database using Hashicorp's implmentation of Raft.
      SQLite implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inssluge countless other applications that people use every day.
But it isn't distributed! That's where Raft comes in...
`,
    },
    {
      slug: 2,
      title: 'My Second Post',
      description: 'My second post on my new website!',
      markdown: `
      ---title: Twitter Clone with Raft---
      # Raft: Simple Twitter Clone"
      This is a simple Twitter clone that implements its distributed SQLite database using Hashicorp's implmentation of Raft.
      SQLite implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inssluge countless other applications that people use every day.
But it isn't distributed! That's where Raft comes in...
`,
    },
    {
      slug: 3,
      title: 'My Third Post',
      description: 'My third post on my new website!',
      markdown: `
      ---title: Twitter Clone with Raft---
      # Raft: Simple Twitter Clone"
      This is a simple Twitter clone that implements its distributed SQLite database using Hashicorp's implmentation of Raft.
      SQLite implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inssluge countless other applications that people use every day.
But it isn't distributed! That's where Raft comes in...
`,
    },
  ]
}

export default function BlogIndexRoute() {
  const blogs = useLoaderData<Array<Blog>>()

  return (
    <main>
      <div className="mb-4">
        <h1 className="text-zinc-800 text-4xl font-bold">My Blog</h1>
      </div>
      <section>
        <div className="grid">
          {blogs.map(blog => (
            <div
              key={blog.slug}
              className="border-2 border-solslug border-slate-200 mt-4 p-4 rounded-sm"
            >
              <Link to={`/blog/${blog.slug}`} className="">
                <h1 className="text-xl font-bold">{blog.title}</h1>
                <p>{blog.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
