import { useState, useRef } from 'react'

export function HamburgerIcon({ active }: { active: boolean }) {
  //non tailwind styles: (these styles don't exist in tailwind)
  const svgStyles = {
    transition: '0.3s linear',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeMiterlimit: 1.5,
  }

  const pathStyles = {
    strokeDasharray: active ? '75.39' : '30, 75.39',
    strokeDashoffset: active ? -60 : 0,
    transition: 'all 0.6s cubic-bezier(0.6, 0.33, 0.67, 1.29)',
  }

  return (
    <div className="group">
      <span className="block duration-200 ease-linear group-hover:translate-y-3 group-hover:opacity-0">
        {active ? 'BACK' : 'MENU'}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="duration-100 ease-linear group-hover:-translate-y-5"
        style={svgStyles}
        viewBox="0 0 32 42"
      >
        <g transform="matrix(1,0,0,1,-389.5,-264.004)">
          <g id="arrow_left2">
            <g transform="matrix(1,0,0,1,0,5)">
              <path
                style={pathStyles}
                className="fill-none stroke-white stroke-1"
                d="M390,270L420,270L420,270C420,270 420.195,250.19 405,265C389.805,279.81 390,279.967 390,279.967"
              />
            </g>
            <g transform="matrix(1,1.22465e-16,1.22465e-16,-1,0.00024296,564.935)">
              <path
                style={pathStyles}
                className="fill-none stroke-white stroke-1"
                d="M390,270L420,270L420,270C420,270 420.195,250.19 405,265C389.805,279.81 390,279.967 390,279.967"
              />
            </g>
            <path
              className="fill-none stroke-white stroke-1"
              d="M390,284.967L420,284.967"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}
