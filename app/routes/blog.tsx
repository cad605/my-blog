import {Outlet} from 'remix'

export default function PostsRoute() {
  return (
    <div className="flex">
      <h1 className="font-serif font-bold">Some of my Posts...</h1>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
