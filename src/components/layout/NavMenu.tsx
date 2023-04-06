import Link from 'next/link'
import React from 'react'

const NavMenu = ({ active }: { active: boolean }) => {
  return (
    <div
      className={`absolute -left-60 top-0 z-20 h-screen w-60 bg-slate-800 pt-6 text-white shadow-lg ring-1 ring-black ring-opacity-5 duration-200 ease-linear focus:outline-none
        ${active ? 'translate-x-60' : ''}`}
    >
      <Links active={active} />
    </div>
  )
}

const Links = ({ active }: { active: boolean }) => {
  const links = [
    {
      title: 'TBD',
      href: '/tbd',
    },
    {
      title: 'TBD',
      href: '/tbd',
    },
    {
      title: 'TBD',
      href: '/tbd',
    },
  ]
  return (
    <>
      {links.map((link, idx) => (
        <Link key={link.href} href={link.href} aria-current="page">
          <div className="group cursor-pointer duration-200 hover:translate-x-3">
            <div
              className={`${
                active ? 'translate-x-52' : ''
              } -ml-52 mr-52 block pb-5 pl-3 pt-5 duration-300`}
              style={{ transitionDelay: (idx + 1) * 100 + 'ms' }}
            >
              <div className="absolute bottom-2 left-0 right-0 top-2 -z-10 -ml-60 mr-60 bg-slate-800 duration-200 group-hover:translate-x-48"></div>
              {/* <a className="text-center font-bold">
                {link.title}{' '}
                <div className="float-right -mb-1 ml-3 inline-block">
                  <ChevronIcon animationTrigger={active}></ChevronIcon>
                </div>
              </a> */}
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}
export default NavMenu
