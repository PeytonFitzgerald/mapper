import React from 'react'
import { USEcon } from '@prisma/client'
import { useContext } from 'react'
import { EconContext } from '../../Dashboard'
interface HoveredStateInfoProps {
  hoveredStateInfo: USEcon | null
  mousePosition: { x: number; y: number }
}

const HoveredStateInfo: React.FC<HoveredStateInfoProps> = ({
  hoveredStateInfo,
  mousePosition,
}) => {
  const econContext = useContext(EconContext)
  if (!hoveredStateInfo || !econContext) {
    return null
  }
  const currentIndicator = econContext.econ_indicator
  return (
    <div
      className="absolute z-10"
      style={{
        left: `${mousePosition.x + 10}px`,
        top: `${mousePosition.y + 10}px`,
      }}
    >
      <h3>{hoveredStateInfo.name}</h3>
      <p>
        {econContext?.econ_indicator}:{' '}
        {hoveredStateInfo[currentIndicator ?? ''] ?? 'N/A'}
      </p>
    </div>
  )
}

export default HoveredStateInfo
