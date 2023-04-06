import { useContext } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/ui/dropdown/dropdown-menu'
import { Button } from '@/components/common/ui/buttons/generic-button'
import { EconDispatchContext, EconIndicatorLookup } from '../../Dashboard'
import { EconContext } from '../../Dashboard'
interface EconIndicatorDropdownProps {
  econIndicators: EconIndicatorLookup[]
  handleChange: (indicatorLookup: EconIndicatorLookup) => void
  currentLookup: EconIndicatorLookup
}

export const EconIndicatorDropdown: React.FC<EconIndicatorDropdownProps> = ({
  econIndicators,
  handleChange,
  currentLookup,
}) => {
  const econContext = useContext(EconContext)
  if (!econContext) {
    return null
  }
  return (
    <div className="relative left-4 top-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle">{currentLookup.name}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Economic Variables Available</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {econIndicators.map((indicator) => (
            <DropdownMenuItem
              key={indicator.key}
              onClick={() => handleChange(indicator)}
            >
              {indicator.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const YearDropdown: React.FC = () => {
  const econContext = useContext(EconContext)
  const econDispatchContext = useContext(EconDispatchContext)
  if (!econContext || !econDispatchContext) {
    return null
  }
  const years = [
    1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
    2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
    2022,
  ]
  return (
    <div className="relative left-4 top-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle">{econContext.year}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Years Available</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {years.map((year) => (
            <DropdownMenuItem
              onClick={() =>
                econDispatchContext({
                  type: 'SET_YEAR',
                  year: year,
                })
              }
            >
              {year}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
