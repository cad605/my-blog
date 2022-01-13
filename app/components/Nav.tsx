import {Link} from 'remix'

type NavLink = {
  name: string
  target: string
}

export default function Nav() {
  const navLinks: Array<NavLink> = [
    {name: 'Blog', target: '/blog'},
    {name: 'About', target: '/about'},
  ]

  return (
    <header className="mb-8 animate-appear">
      <div className="flex flex-col items-center pl-6 border-b-8 border-zinc-800 md:flex-row md:items-stretch">
        <div className="bg-gradient-to-tr from-slate-200 to-zinc-800 m-2 p-1 rounded-full">
          <Link
            prefetch="intent"
            to="/"
            className="block bg-white p-1 rounded-full"
          >
            <h1 className="flex flex-col items-center justify-center bg-zinc-800 text-white text-4.5xl rounded-full h-16 w-16">
              C
            </h1>
          </Link>
        </div>
        <nav className="m-4 flex-1 flex flex-wrap justify-center md:m-0 md:justify-end">
          {navLinks.map(link => (
            <Link
              prefetch="intent"
              className="flex items-center relative group px-4 text-sm uppercase flex-shrink-0 md:px-8 md:text-xl"
              key={link.name}
              to={link.target}
            >
              <span className="absolute top-0 left-0 w-0.5 h-full bg-slate-200 transform -skew-x-20"></span>
              <span className="relative">
                {link.name}
                <span className="absolute w-full h-1 bg-zinc-800 -bottom-1 left-0 rounded-sm transform scale-x-0 group-hover:scale-x-100 transition duration-300"></span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
