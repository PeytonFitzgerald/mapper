// ClickedStateInfo.tsx
import React from 'react'
import { USEcon } from '@prisma/client'

interface ClickedStateInfoProps {
  clickedStateInfo: USEcon | null
  handleCloseClick: () => void
}

const ClickedStateInfo: React.FC<ClickedStateInfoProps> = ({
  clickedStateInfo,
  handleCloseClick,
}) => {
  if (!clickedStateInfo) {
    return null
  }

  return (
    <div className="absolute right-4 top-4 z-10 rounded-md border border-gray-300 bg-white p-4 shadow">
      {/* Add content to display state information */}
      <button
        className="absolute right-0 top-0 rounded-md bg-red-500 p-1 text-white"
        onClick={handleCloseClick}
      >
        ×
      </button>
    </div>
  )
}

export default ClickedStateInfo
