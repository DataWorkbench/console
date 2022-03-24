import { PropsWithChildren, useContext, useEffect, useRef } from 'react'
import JsplumbContext from './Context'

function capitalize(sentence: string) {
  return sentence && sentence[0].toUpperCase() + sentence.slice(1)
}

// TODO: props type
function MappingItem(props: PropsWithChildren<any>) {
  const ref = useRef()
  const { instance, addNode } = useContext(JsplumbContext)
  const { type, data, children } = props
  const unmoundRef = useRef<Function>()
  useEffect(() => {
    if (ref.current && instance) {
      const common = {
        isSource: type !== 'left',
        isTarget: type === 'left',
        connector: ['Straight'],
        id: data.uuid,
        connectorOverlays: [
          [
            'Arrow',
            {
              location: 1,
              width: 13,
              length: 13,
              cssClass: 'mapping-arrow',
            },
          ],
        ],
        connectorStyle: {
          gradient: {
            stops: [
              [0, '#229CE9'],
              [1, '#15A675'],
            ],
          },
          strokeWidth: 2,
          stroke: '#fff',
          zIndex: 2,
        },

        endpoint: [
          'Dot',
          {
            cssClass: `${type}-mapping-point mapping-point`,
            // hoverClass: `${type}-hover-mapping-point `,
          },
        ],
        endpointStyle: {
          radius: 7,
        },
      }
      // if (instance.getEndpoints(data.uuid)) {
      //   instance.deleteEndpoint(data.uuid)
      // }

      unmoundRef.current = () => instance.deleteEndpoint(data.uuid)
      if (!instance!.getEndpoint(data.uuid)) {
        instance.addEndpoint(
          ref.current,
          {
            anchors: [capitalize(type)],
            uuid: data.uuid,
            data: {
              ...data,
              type,
            },
            ...common,
          },
          {
            uuid: data.uuid,
            data: {
              ...data,
              type,
            },
            ...common,
          }
        )
        addNode?.(data.uuid)
      }
    }
  }, [addNode, data, instance, type])

  useEffect(() => {
    return () => {
      if (unmoundRef.current) {
        unmoundRef.current?.()
      }
    }
  }, [])

  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  )
}

export default MappingItem
