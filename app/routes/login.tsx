import {
  useTransition,
  useActionData,
  redirect,
  Form,
  json,
  useCatch,
  Link,
  useSearchParams,
} from 'remix'
import type {ActionFunction, LoaderFunction, MetaFunction} from 'remix'
import invariant from 'tiny-invariant'
import {db} from '~/utils/db.server'
import {
  requireUserId,
  getUserId,
  login,
  createUserSession,
} from '~/utils/session.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Chris Donnelly | Login',
    description: 'Login to my personal site',
  }
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    username: string | undefined
    password: string | undefined
  }
  fields?: {
    password: string
    username: string
    redirectTo: string
  }
}

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Usernames must be at least 3 characters long`
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`
  }
}

const badRequest = (data: ActionData) => json(data, {status: 400})

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData()

  const password = formData.get('password')
  const username = formData.get('username')
  const redirectTo = formData.get('redirectTo') || '/'

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    })
  }

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  }

  const fields = {password, username, redirectTo}
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({fieldErrors, fields})
  }

  const user = await login({username, password})
  if (!user) {
    return badRequest({
      fields,
      formError: `Username/Password combination is incorrect`,
    })
  }

  return createUserSession(user.id, redirectTo)
}

export default function NewPost() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const [searchParams] = useSearchParams()

  return (
    <div className="mt-6 sm:mx-auto sm:w-full">
      <div className="py-8 px-6 sm:px-10 border border-slate-600 p-4 rounded-xl">
        <Form method="post" className="space-y-4">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <div>
            <label className="block text-xl text-zinc-800 font-medium">
              Username:{' '}
              {actionData?.fieldErrors?.username ? (
                <em
                  role="alert"
                  id="name-error"
                  className="text-red-800 text-base"
                >
                  Username is required
                </em>
              ) : null}
            </label>
            <div>
              <input
                type="text"
                defaultValue={actionData?.fields?.username}
                name="username"
                aria-role={'username-input'}
                aria-required={true}
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.username) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.username
                    ? 'username-error'
                    : undefined
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xl text-zinc-800 font-medium">
              Password:{' '}
              {actionData?.fieldErrors?.password ? (
                <em
                  role="alert"
                  id="name-error"
                  className="text-red-800 text-base"
                >
                  Password is required
                </em>
              ) : null}
            </label>
            <div>
              <input
                type="password"
                defaultValue={actionData?.fields?.password}
                name="password"
                aria-role={'password-input'}
                aria-required={true}
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.password) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.password
                    ? 'password-error'
                    : undefined
                }
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="transfrom hover:-translate-y-1 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-800 focus:bg-zinc-800"
            >
              {transition.submission ? 'Logging in...' : 'Log In'}
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
        Something went wrong logging you in...
      </p>
    </div>
  )
}
