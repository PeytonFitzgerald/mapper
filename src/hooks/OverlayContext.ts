import React from 'react'

export const overlayContext = React.createContext({
  overlay: {
    visible: false,
    zIndex: 'z-10',
    opacity: 50,
  },
  setOverlay: (overlay: any) => {},
})
