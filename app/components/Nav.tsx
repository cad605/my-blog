import {Link} from 'remix'

type NavLink = {
  name: string
  target: string
}

export default function Nav() {
  const navLinks: Array<NavLink> = [
    {name: 'Blog', target: '/blog'},
    {name: 'Projects', target: '/projects'},
    {name: 'About', target: '/about'},
  ]

  return (
    <header className="mb-8">
      <div className="pl-6 border-b-8 border-zinc-800 flex flex-col items-center md:flex-row md:items-stretch">
        <h1 className="flex items-center justify-center bg-zinc-800 text-white text-4.5xl my-2 p-4 uppercase h-16 w-16 md:my-6 rounded-full">
          <Link to="/" className="hover:underline">
            C
          </Link>
        </h1>
        <nav className="m-4 flex-1 flex flex-wrap justify-center md:m-0 md:justify-end">
          {navLinks.map(link => (
            <Link
              className="flex items-center relative group px-4 text-sm uppercase flex-shrink-0 md:px-8 md:text-xl"
              key={link.name}
              to={link.target}
            >
              <span className="absolute top-0 left-0 w-0.5 h-full bg-gray-200 transform -skew-x-20"></span>
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
