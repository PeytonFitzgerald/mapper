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
import { EconIndicatorLookup } from '../../Dashboard'
import { EconContext } from '../../Dashboard'
interface DropdownMenuComponentProps {
  econIndicators: EconIndicatorLookup[]
  handleChange: (indicatorLookup: EconIndicatorLookup) => void
}

const DropdownMenuComponent: React.FC<DropdownMenuComponentProps> = ({
  econIndicators,
  handleChange,
}) => {
  const econContext = useContext(EconContext)
  return (
    <div className="relative left-4 top-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle">{econContext?.econ_indicator}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
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

export default DropdownMenuComponent
