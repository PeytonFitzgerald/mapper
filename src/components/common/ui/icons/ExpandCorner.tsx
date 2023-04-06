import { withSize } from './Icon'
export const ExpandCorner = withSize(({ sizeClass }) => (
  <svg
    fill="currentColor"
    className={sizeClass}
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g strokeLinecap="round" strokeLinejoin="round"></g>
    <g>
      <circle cx="12" cy="24" r="1.5"></circle>
      <circle cx="18" cy="24" r="1.5"></circle>
      <circle cx="18" cy="18" r="1.5"></circle>
      <circle cx="24" cy="12" r="1.5"></circle>
      <circle cx="24" cy="24" r="1.5"></circle>
      <circle cx="24" cy="18" r="1.5"></circle>
      <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect>
    </g>
  </svg>
))
