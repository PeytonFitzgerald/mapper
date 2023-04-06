import { useState } from 'react'
import { EconIndicatorLookup } from '../../Dashboard'
import { EconIndicatorDropdown, YearDropdown } from './Dropdowns'
import { Toggle } from '@/components/common/ui/buttons/toggle'
import React from 'react'
interface MenuProps {
  handleChange: (indicatorLookup: EconIndicatorLookup) => void
  econIndicators: EconIndicatorLookup[]
  currentLookup: EconIndicatorLookup
}

export const Menu: React.FC<MenuProps> = ({
  currentLookup,
  econIndicators,
  handleChange,
}) => {
  const [showDropdowns, setShowDropdowns] = useState(false)

  const toggleDropdowns = () => {
    setShowDropdowns(!showDropdowns)
  }
  return (
    <div className="relative left-4 top-4 w-1/5">
      <Toggle onToggle={toggleDropdowns}>Menu</Toggle>
      {showDropdowns && (
        <div className="grid grid-cols-2">
          <EconIndicatorDropdown
            econIndicators={econIndicators}
            handleChange={handleChange}
            currentLookup={currentLookup}
          />
          <YearDropdown />
        </div>
      )}
    </div>
  )
}
