
import React from 'react';
import { Link, navigate } from "@reach/router"

// We wrap Reach Router Link & navigate to ensure they use absolute paths
// Based on discussion and example at
// https://github.com/reach/router/issues/78#issuecomment-404478024

// For deploying at 'https://will-moore.github.io/idr
export const BASEPATH = '/idr'

export const AbsoluteLink = ({ to = '', children, ...props }) => {
  to = BASEPATH + to
  return (
    <Link {...props} to={to}>
      {children}
    </Link>
  )
}

export const absoluteNavigate = (to) => {
  to = BASEPATH + to;
  navigate(to);
}
