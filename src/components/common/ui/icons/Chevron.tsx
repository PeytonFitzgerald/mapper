import { useState, useRef, useEffect } from 'react'

export function ChevronIcon({
  animationTrigger,
}: {
  animationTrigger: boolean
}) {
  const animate1 = useRef<SVGAnimateElement>(null)
  const animate2 = useRef<SVGAnimateElement>(null)
  const animate3 = useRef<SVGAnimateElement>(null)
  const animate4 = useRef<SVGAnimateElement>(null)

  function animate() {
    animate1.current?.beginElement()
    animate2.current?.beginElement()
    animate3.current?.beginElement()
    animate4.current?.beginElement()
  }

  useEffect(() => {
    return () => {
      animate()
    }
  }, [animationTrigger])

  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <line x1="0" y1="0" x2="12" y2="12" className="stroke-white">
        <animate
          ref={animate1}
          attributeName="y1"
          from="12"
          to="0"
          dur="900ms"
        />
        <animate
          ref={animate2}
          attributeName="x2"
          from="24"
          to="12"
          dur="900ms"
        />
      </line>
      <line x1="0" y1="24" x2="12" y2="12" className="stroke-white">
        <animate
          ref={animate3}
          attributeName="y1"
          from="12"
          to="24"
          dur="900ms"
        />
        <animate
          ref={animate4}
          attributeName="x2"
          from="24"
          to="12"
          dur="900ms"
        />
      </line>
    </svg>
  )
}
