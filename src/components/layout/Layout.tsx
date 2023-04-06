import { useState } from 'react'
import React from 'react'
import { overlayContext } from '@/hooks/OverlayContext'
import { useClickOutside } from '@/hooks/useClickOutside'
import { SideNav } from './Sidenav'
import clsx from 'clsx'
interface HeaderInterface {
  children?: React.ReactNode
  useContainer: boolean
}

const Overlay = ({
  visible,
  zIndex,
  opacity,
}: {
  visible: boolean
  zIndex: string
  opacity: number
}) => {
  //TODO animate opacity change
  const bgStyle = {
    background: `rgba(0,0,0,0.${opacity})`,
  }
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 top-0 ${
        visible ? 'block' : 'hidden'
      } ${zIndex} bg-slate-800/${opacity}`}
      style={bgStyle}
    ></div>
  )
}
export const PageLayout: React.FC<HeaderInterface> = ({
  children,
  useContainer = true,
}) => {
  const [overlay, setOverlay] = useState({
    visible: false,
    zIndex: 'z-20',
    opacity: 50,
  })
  const overlayValue = { overlay, setOverlay }
  return (
    <>
      <div className="flex">
        <overlayContext.Provider value={overlayValue}>
          <div className="fixed inset-y-0 z-20 w-28">
            <SideNav />
          </div>
          <div className="ml-28 flex-1">
            <main
              className={clsx(
                'mx-auto flex min-h-screen flex-col',
                useContainer && 'container'
              )}
            >
              {children}
            </main>
            {/*<Footer />*/}
          </div>
        </overlayContext.Provider>
      </div>
      <Overlay
        visible={overlay.visible}
        zIndex={overlay.zIndex}
        opacity={overlay.opacity}
      />
    </>
  )
}
