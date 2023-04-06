// ClickedStateInfo.tsx
import React from 'react'
import { USEcon } from '@prisma/client'
import { EconIndicatorLookup } from '../../Dashboard'
import { api } from '@/utils/api'
import { ThreeDots } from 'react-loader-spinner'
interface ClickedStateInfoProps {
  clickedStateInfo: USEcon | null
  handleCloseClick: () => void
  currentLookup: EconIndicatorLookup
}

const ClickedStateInfo: React.FC<ClickedStateInfoProps> = ({
  clickedStateInfo,
  handleCloseClick,
  currentLookup,
}) => {
  if (!clickedStateInfo) {
    return null
  }
  console.log(currentLookup)
  const { data: data, isLoading } =
    api.stateRouter.getSpecificStateEconData.useQuery({
      state: clickedStateInfo.name,
    })

  return (
    <div className="absolute right-4 top-4 z-10 rounded-md border border-gray-300 bg-white p-4 shadow">
      {/* Add content to display state information */}
      <button
        className="absolute right-0 top-0 rounded-md bg-red-500 p-1 text-white"
        onClick={handleCloseClick}
      >
        ×
      </button>
      {isLoading ? <ThreeDots /> : <div>have data for {data?.name}</div>}
    </div>
  )
}

export default ClickedStateInfo
