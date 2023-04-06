import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useRef, useContext } from 'react'
import React from 'react'
import Image from 'next/image'
import ThemeButton from '../common/ui/buttons/ThemeButon'
//import ProfileImage from '@/assets/profile.jpeg'
import { useClickOutside } from '@/hooks/useClickOutside'
import NavMenu from './NavMenu'
import { HamburgerIcon } from '@/components/common/ui/icons/Hamburger'
import { overlayContext } from '@/hooks/OverlayContext'

export const SideNav = () => {
  const { data: sessionData } = useSession()
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)
  const openNavMenuButtonRef = useRef<HTMLButtonElement>(null)
  const { overlay, setOverlay } = useContext(overlayContext)

  const toggleNavMenu = () => {
    setIsNavMenuOpen(!isNavMenuOpen)
    if (!isNavMenuOpen) {
      setOverlay({
        visible: true,
        zIndex: 'z-10',
        opacity: 50,
      })
    } else {
      setOverlay({
        visible: false,
        zIndex: 'z-10',
        opacity: 50,
      })
    }
  }

  const setNavFalse = () => {
    if (isNavMenuOpen) {
      toggleNavMenu()
    }
  }

  useClickOutside({
    ref: openNavMenuButtonRef,
    onClose: setNavFalse,
  })
  return (
    <>
      <div
        className={`z-20 h-full bg-slate-800 text-white duration-200 ease-linear ${
          isNavMenuOpen ? 'translate-x-60' : ''
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="mx-auto mt-5">
            <button
              ref={openNavMenuButtonRef}
              onClick={toggleNavMenu}
              type="button"
              className=""
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <HamburgerIcon active={isNavMenuOpen}></HamburgerIcon>
            </button>
          </div>
          <nav className="px-2">{/*<Links />*/}</nav>
          <div className="flex-1"></div>
          <div className="mb-5 text-center">
            {sessionData ? (
              <LoggedInSection name={sessionData?.user?.name} />
            ) : (
              <LoggedOutSection />
            )}
          </div>
          <div className="mb-10 mt-auto items-center text-center">
            <ThemeButton />
          </div>
        </div>
      </div>
      <NavMenu active={isNavMenuOpen} />
    </>
  )
}

const LoggedOutSection = () => {
  return (
    <div className="bg-mitre-blue relative text-center">
      <button className="h-20 leading-5" onClick={() => signIn()}>
        {'SIGN IN'}
      </button>
    </div>
  )
}

const LoggedInSection = ({ name }: { name: string | undefined | null }) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const openAccountMenuButtonRef = useRef<HTMLButtonElement>(null)
  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen)
  }

  const closeAccountMenu = () => {
    setIsAccountMenuOpen(false)
  }

  useClickOutside({
    ref: openAccountMenuButtonRef,
    onClose: closeAccountMenu,
  })

  return (
    <>
      <div className="relative">
        <div className="mx-auto mt-4 flex justify-center">{name}</div>

        <div className="mx-auto mt-4 flex justify-center">
          <button
            ref={openAccountMenuButtonRef}
            onClick={toggleAccountMenu}
            type="button"
            className="rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>

            {/* <Image
              width="50"
              height="50"
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full"
              //src={ProfileImage}
              alt=""
            /> */}
          </button>
        </div>
        {isAccountMenuOpen && <AccountMenu />}
      </div>
    </>
  )
}

const AccountMenu = () => {
  return (
    <div className="bg-bgSecondary absolute bottom-0 left-[112px] z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 text-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-50">
      <Link href="/profile">
        <a className="link-primary block px-4 py-2 text-sm hover:underline">
          Profile
        </a>
      </Link>
      <Link href="/favorites">
        <a className="link-primary block px-4 py-2 text-sm hover:underline">
          Favorites
        </a>
      </Link>
      <a
        onClick={() => signOut()}
        href="#"
        className="link-primary block px-4 py-2 text-sm hover:underline"
      >
        Sign out
      </a>
    </div>
  )
}

export default AccountMenu
