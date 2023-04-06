import React from 'react'
import { USEcon } from '@prisma/client'
import { useContext } from 'react'
import { EconContext, EconIndicatorLookup } from '../../Dashboard'
import { formatNumber } from '@/utils/format'
interface HoveredStateInfoProps {
  hoveredStateInfo: USEcon | null
  mousePosition: { x: number; y: number }
  currentLookup: EconIndicatorLookup
}

const HoveredStateInfo: React.FC<HoveredStateInfoProps> = ({
  hoveredStateInfo,
  mousePosition,
  currentLookup,
}) => {
  const econContext = useContext(EconContext)
  if (!hoveredStateInfo || !econContext) {
    return null
  }
  const currentIndicator = econContext.econ_indicator

  const ele_name = currentLookup?.name ?? currentIndicator
  const type = currentLookup?.type ?? 'count'
  return (
    <div
      className="absolute z-10 rounded bg-slate-300 p-2 text-white shadow-lg dark:bg-slate-800"
      style={{
        left: `${mousePosition.x + 20}px`,
        top: `${mousePosition.y - 30}px`,
      }}
    >
      <h3>{hoveredStateInfo.name}</h3>
      <p>
        {ele_name}:{' '}
        {formatNumber(hoveredStateInfo[currentIndicator] ?? 0, type) ?? 'N/A'}
      </p>
    </div>
  )
}

export default HoveredStateInfo
