import {Link} from 'remix'

type ArrowButtonProps = {
  direction?: 'up' | 'down' | 'left' | 'right'
  href?: string
  children?: React.ReactNode | React.ReactNode[]
}

export default function ArrowButton({
  direction,
  href,
  children,
  ...props
}: ArrowButtonProps) {
  return (
    <Link
      to={href ? href : '/'}
      className={`text-zinc-800 font-medium group hover:underline animate-[slide_1s_ease-in-out]`}
    >
      {direction === 'left' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 inline-block group-hover:-translate-x-1 transition duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 17l-5-5m0 0l5-5m-5 5h12"
          />
        </svg>
      ) : null}
      {direction === 'up' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block h-6 w-6 transition group-hover:-translate-y-1 duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
      ) : null}
      {direction === 'down' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 inline-block transition group-hover:translate-y-1 duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 13l-5 5m0 0l-5-5m5 5V6"
          />
        </svg>
      ) : null}
      {children}
      {direction === 'right' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 inline-block group-hover:translate-x-1 transition duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      ) : null}
    </Link>
  )
}
