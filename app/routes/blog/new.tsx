import {
  useTransition,
  useActionData,
  redirect,
  Form,
  json,
  useCatch,
  Link,
} from 'remix'
import type {ActionFunction, LoaderFunction} from 'remix'
import invariant from 'tiny-invariant'
import {db} from '~/utils/db.server'
import {requireUserId, getUserId} from '~/utils/session.server'

export const loader: LoaderFunction = async ({request}) => {
  const userId = await requireUserId(request)
  return {}
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    slug: boolean | undefined
    title: boolean | undefined
    description: boolean | undefined
    markdown: boolean | undefined
  }
  fields?: {
    slug: string
    title: string
    description: string
    markdown: string
  }
}

const badRequest = (data: ActionData) => json(data, {status: 400})

export const action: ActionFunction = async ({request}) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()

  const slug = formData.get('slug')
  const title = formData.get('title')
  const description = formData.get('description')
  const markdown = formData.get('markdown')

  const fieldErrors = {
    slug: false,
    title: false,
    description: false,
    markdown: false,
  }

  if (!slug) fieldErrors.slug = true
  if (!title) fieldErrors.title = true
  if (!title) fieldErrors.description = true
  if (!markdown) fieldErrors.markdown = true

  invariant(typeof slug === 'string')
  invariant(typeof title === 'string')
  invariant(typeof description === 'string')
  invariant(typeof markdown === 'string')

  const fields = {slug, title, description, markdown}
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({fieldErrors, fields})
  }

  const blog = await db.blog.create({
    data: {...fields, userId: userId},
  })
  return redirect(`/blog/${blog.slug}`)
}

export default function NewPost() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()

  return (
    <div className="mt-6 sm:mx-auto sm:w-full">
      <div className="py-8 px-6 sm:px-10 border-2 border-slate-600 p-4 rounded-xl">
        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-xl text-zinc-800 font-medium">
              Title:{' '}
              {actionData?.fieldErrors?.title ? (
                <em role="alert" id="name-error">
                  Title is required
                </em>
              ) : null}
            </label>
            <div>
              <input
                type="text"
                required={true}
                defaultValue={actionData?.fields?.title}
                name="title"
                aria-role={'title-input'}
                aria-required={true}
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.title) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.title ? 'title-error' : undefined
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xl text-zinc-800 font-medium">
              Slug:{' '}
              {actionData?.fieldErrors?.slug ? (
                <em role="alert" id="name-error">
                  Slug is required
                </em>
              ) : null}
            </label>
            <div>
              <input
                type="text"
                required={true}
                defaultValue={actionData?.fields?.slug}
                name="slug"
                aria-role={'slug-input'}
                aria-required={true}
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.slug) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.slug ? 'slug-error' : undefined
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xl text-zinc-800 font-medium">
              Description:{' '}
              {actionData?.fieldErrors?.description ? (
                <em role="alert" id="name-error">
                  description is required
                </em>
              ) : null}
            </label>
            <div>
              <input
                type="text"
                required={true}
                defaultValue={actionData?.fields?.description}
                name="description"
                aria-role={'description-input'}
                aria-required={true}
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.description) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.description
                    ? 'description-error'
                    : undefined
                }
              />
            </div>
          </div>
          <div>
            <label
              className="block text-xl text-zinc-800 font-medium"
              htmlFor="markdown"
            >
              Markdown:
            </label>{' '}
            {actionData?.fieldErrors?.markdown ? (
              <em>Markdown is required</em>
            ) : null}
            <br />
            <textarea id="markdown" rows={20} name="markdown" />
          </div>
          <div>
            <button
              type="submit"
              className="transfrom hover:-translate-y-1 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-800 focus:bg-zinc-800"
            >
              {transition.submission ? 'Creating Post...' : 'Post Blog'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  switch (caught.status) {
    case 401: {
      return (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="font-bold text-4xl text-zinc-800">Sorry!</h1>
          <p className="text-2xl text-slate-600">
            You're either me and you haven't logged in, or you're not supposed
            to be here so scram!
          </p>
          <Link to="/login">Login</Link>
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

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="font-bold text-4xl text-zinc-800">Sorry!</h1>
      <p className="text-2xl text-slate-600">
        Something went wrong creating the blog post...
      </p>
    </div>
  )
}
