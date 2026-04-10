'use client'

import * as React from 'react'

type AspectRatioProps = React.HTMLAttributes<HTMLDivElement> & {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="aspect-ratio"
        style={{ aspectRatio: String(ratio), ...style }}
        {...props}
      />
    )
  },
)
AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }
