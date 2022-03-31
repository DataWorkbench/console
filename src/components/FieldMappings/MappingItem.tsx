import { Interpolation, Theme } from '@emotion/react'
import { AnchorSpec, Endpoint, jsPlumbInstance } from 'jsplumb'
import { PropsWithChildren, useEffect, useRef } from 'react'
import { useUnmount } from 'react-use'

interface MappingItemProps {
  anchor: AnchorSpec
  data: Record<string, any>
  css: Interpolation<Theme>
  jsplumb?: jsPlumbInstance
}

function MappingItem(props: PropsWithChildren<MappingItemProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const { jsplumb, anchor, data, children } = props
  const endPointRef = useRef<Endpoint | null>(null)

  useEffect(() => {
    if (ref.current && jsplumb) {
      const endPoint = endPointRef.current
      if (endPoint) {
        jsplumb.deleteEndpoint(endPoint)
      }
      endPointRef.current = jsplumb.addEndpoint(ref.current, {
        anchor,
        parameters: { [String(anchor)]: data },
        isSource: anchor !== 'Left',
        isTarget: anchor === 'Left',
        connectorStyle: {
          gradient: {
            stops: [
              [0, '#229CE9'],
              [1, '#15A675'],
            ],
          },
          strokeWidth: 2,
          stroke: '#fff',
        },
        connectorHoverStyle: {
          strokeWidth: 3,
        },
        endpoint: [
          'Dot',
          {
            cssClass: `point-${anchor}`,
            radius: 6,
          },
        ],
        paintStyle: {
          fill: anchor === 'Left' ? '#15a675' : '#229ce9',
          stroke: '#fff',
          strokeWidth: 2,
        },
        'connector-pointer-events': 'visible',
        uuid: `${anchor}-${data.name}`,
      } as any) as Endpoint
    }
  }, [data, jsplumb, anchor])

  useUnmount(() => {
    const endPoint = endPointRef.current
    if (jsplumb && endPoint) {
      jsplumb.deleteEndpoint(endPoint)
    }
  })

  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  )
}

export default MappingItem
