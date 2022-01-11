import {useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'
import invariant from 'tiny-invariant'
import fm from 'front-matter'
import {marked} from 'marked'

export const loader: LoaderFunction = async ({params}) => {
  const data = [
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

      ---
title: 90s Mixtape
---

# 90s Mixtape

- I wish (Skee-Lo)
- This Is How We Do It (Montell Jordan)
- Everlong (Foo Fighters)
      
      `,
    },
  ]
  invariant(params.slug, 'expected params.slug')
  const {body} = fm(data[2].markdown)
  const html = marked(body)
  return html
}

export default function PostSlug() {
  const markdown = useLoaderData()
  return (
    <article className="mt-16 mx-auto prose prose-slate">
      <div dangerouslySetInnerHTML={{__html: markdown}}></div>
    </article>
  )
}
