import {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import tippy from 'tippy.js'
import { render } from 'react-dom'
import { Icon } from '@QCFE/lego-ui'
import { jsPlumb } from 'jsplumb'
import tw, { css, styled } from 'twin.macro'
import { isEqual } from 'lodash-es'
import JsplumbContext from './Context'

const MenuWrapper = styled.div`
  ${tw`bg-neut-17 border border-neut-13 rounded-[2px]  p-2.5 h-10 w-[140px] flex items-center pl-3.5`}
`

const wrapperStyle = [
  css`
    & {
      .mapping-arrow {
        fill: #15a675;
        stroke: #15a675;
        stroke-width: 2px;
        z-index: 1;
      }

      .jtk-endpoint {
        ${tw`w-4! h-4!`}
        z-index: 5;
        visibility: hidden !important;

        svg {
          ${tw`rounded-full`}
          circle {
            stroke: #fff !important;
            stroke-width: 4 !important;
          }
        }
      }

      .left-mapping-point svg circle,
      .left-hover-mapping-point svg circle {
        fill: #15a675 !important;
      }

      .right-mapping-point,
      .right-hover-mapping-point {
        z-index: 3;

        svg circle {
          fill: #229ce9 !important;
        }
      }

      //.mapping-point.jtk-endpoint-connected,
      //.mapping-point.jtk-endpoint-full,
      .mapping-point.jtk-hover,
      .mapping-point.jtk-drag,
      .mapping-point.jtk-drag-hover,
      .mapping-point.checked,
      .mapping-point.jtk-endpoint-drop-allowed,
      .mapping-point.jtk-drag-active:hover {
        visibility: visible !important;
      }

      svg.mapping-checked {
        path {
          stroke-width: 5px !important;
        }
      }

      svg.mapping-checked.jtk-dragging {
        path {
          stroke-width: 2px !important;
        }
      }
    }
  `,
]

export interface IMappingsRef {
  clear: () => void
  mapping: (left: string, right: string) => void
}

const useMapping = () => {
  const nodes = useRef(new Map<string, Map<string, () => void>>())
  const nodeIds = useRef(new Set<string>())

  const addNode = (uuid: string) => {
    nodeIds.current.add(uuid)
    if (nodes.current.has(uuid)) {
      nodes.current.get(uuid)!.forEach((cb, right) => {
        if (nodeIds.current.has(right)) {
          cb()
          nodes.current.get(uuid)!.delete(right)
          nodes.current.get(right)!.delete(uuid)
        }
      })
    }
  }

  const addMapping = (left: string, right: string, cb: () => void) => {
    if (nodeIds.current.has(left) && nodeIds.current.has(right)) {
      cb()
    } else {
      if (nodes.current.has(left)) {
        nodes.current.get(left)!.set(right, cb)
      } else {
        nodes.current.set(left, new Map([[right, cb]]))
      }
      if (nodes.current.has(right)) {
        nodes.current.get(right)!.set(left, cb)
      } else {
        nodes.current.set(right, new Map([[left, cb]]))
      }
    }
  }

  const reset = () => {
    nodes.current.clear()
    nodeIds.current.clear()
  }

  return {
    addMapping,
    addNode,
    reset,
  }
}

// todo: props type
const MappingContainer = forwardRef(
  (props: PropsWithChildren<any>, containerRef: ForwardedRef<IMappingsRef>) => {
    const ref = useRef<HTMLElement>()
    const activeCbRef = useRef(new Map<string, Function>())
    const [instance, setInstance] = useState<Record<string, any>>()
    const instanceRef = useRef<Record<string, any>>()

    const { children, mappings, onChange, ...rest } = props
    const { addMapping, addNode, reset } = useMapping()

    const tempMappingsRef = useRef<[string, string][]>()

    const hasMove = useRef(false)
    const mapping = useCallback(
      ([source, target]: string) => {
        addMapping(source, target, () => {
          instanceRef.current?.connect({
            uuids: [source, target],
          })
        })
      },
      [addMapping]
    )

    useImperativeHandle(containerRef, () => ({
      mapping,
      clear: () => {
        instanceRef.current!.deleteEveryConnection()
        instanceRef.current?.deleteEveryEndpoint()
        reset()

        // instanceRef.current?.reset(false)

        // instanceRef.current?.repaintEverything()
      },
    }))

    const mappingsRef = useRef<[string, string][]>()

    useEffect(() => {
      // if (!isEqual(mappingsRef.current, mappings)) {
      // 热加载有 bug
      instanceRef.current?.repaintEverything()
      mappings.forEach(mapping)
      mappingsRef.current = mappings
      // }
    }, [mapping, mappings])

    const detachedRef = useRef<[string, string][]>([])

    const handleDelete = () => {
      activeCbRef.current?.forEach((cb) => cb())
      activeCbRef.current.clear()
      if (detachedRef.current?.length) {
        const t = mappingsRef.current?.filter(
          ([s, tt]) =>
            !detachedRef.current.find(([s1, t1]) => s === s1 && tt === t1)
        )
        instanceRef.current!.deleteEveryConnection()
        instanceRef.current?.deleteEveryEndpoint()
        reset()
        onChange([]) // 解决未知 bug
        onChange(t)
        detachedRef.current = []
      }
    }
    useEffect(() => {
      if (ref.current) {
        const container = ref.current!
        const tippyInstance: any = tippy(ref.current, {
          appendTo: 'parent',
          placement: 'right-start',
          trigger: 'manual',
          interactive: true,
          arrow: false,
          offset: [0, 0],
        })

        const handleScroll = () => {
          tippyInstance.hide()
          tippyInstance.unmount()
        }

        const cb = (e: any) => {
          if (activeCbRef.current.size) {
            e.preventDefault()
            e.stopPropagation()
            const dom = document.createElement('div')
            render(
              <MenuWrapper
                onClick={() => {
                  handleDelete()
                  handleScroll()
                }}
              >
                <Icon name="trash" size={14} type="dark" />
                <span tw="ml-2.5">解除映射</span>
              </MenuWrapper>,
              dom
            )

            tippyInstance.setProps({
              content: dom,
              getReferenceClientRect: () => ({
                width: 0,
                height: 0,
                top: e.clientY,
                bottom: e.clientY,
                left: e.clientX,
                right: e.clientX,
              }),
            })
            tippyInstance.show()
          }
        }

        container.addEventListener('contextmenu', cb)
        window.addEventListener('scroll', handleScroll, true)

        const resize = new ResizeObserver(() => {
          instanceRef.current!.repaintEverything()
        })
        resize.observe(ref.current)

        return () => {
          resize.unobserve(container)
          container.removeEventListener('contextmenu', cb)
          window.removeEventListener('scroll', handleScroll, true)
          mappingsRef.current = undefined
          tippyInstance.destroy()
        }
      }
      return () => {}
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      ;(jsPlumb as any).ready(() => {
        const instance1: any = jsPlumb.getInstance({})
        instance1.setContainer(ref.current)
        setInstance(instance1)
        instanceRef.current = instance1

        instance1.bind('click', function (connection: Record<string, any>) {
          if (connection.canvas?.classList.contains('mapping-checked')) {
            connection.endpoints.forEach((point: any) => {
              point.canvas?.classList.remove('checked')
            })
            connection.canvas?.classList.remove('mapping-checked')
            activeCbRef.current.delete(connection.id)
            detachedRef.current = detachedRef.current.filter(
              ([s, t]) =>
                s !== connection.endpoints[0].getUuid() &&
                t !== connection.endpoints[1].getUuid()
            )

            return
          }
          detachedRef.current.push([
            connection.endpoints[0].getUuid(),
            connection.endpoints[1].getUuid(),
          ])
          const clear = () => {
            handleDelete()
            document.removeEventListener('keydown', clear)
          }

          connection.endpoints.forEach((point: any) => {
            point.canvas?.classList.add('checked')
          })
          connection.canvas?.classList.add('mapping-checked')

          activeCbRef.current.set(connection.id, () => {
            instance1.deleteConnection(connection)
          })
          document.addEventListener('keydown', clear)
        })

        instance1.bind(
          'connection',
          function (connection: Record<string, any>) {
            ;[connection.sourceEndpoint, connection.targetEndpoint].forEach(
              (point: any) => {
                point?.canvas?.classList.remove('checked')
              }
            )
            connection.canvas?.classList.remove('mapping-checked')

            let temp
            if (tempMappingsRef.current) {
              temp = tempMappingsRef.current
            } else if (hasMove.current) {
              temp = [
                ...(mappingsRef.current as any),
                [
                  connection.sourceEndpoint.getUuid(),
                  connection.targetEndpoint.getUuid(),
                ],
              ]
            }
            if (temp && !isEqual(temp, mappingsRef.current)) {
              onChange(temp)
            }

            hasMove.current = false
            tempMappingsRef.current = undefined
          }
        )

        instance1.bind(
          'connectionDetached',
          function (connection: Record<string, any>) {
            // 去掉可能的选中效果
            ;[connection.sourceEndpoint, connection.targetEndpoint].forEach(
              (point: any) => {
                point.canvas?.classList.remove('checked')
              }
            )
            if (hasMove.current) {
              hasMove.current = false
              mappingsRef.current = mappingsRef.current?.filter(
                ([s, t]) =>
                  s !== connection.sourceEndpoint.getUuid() &&
                  t !== connection.targetEndpoint.getUuid()
              )
              onChange(mappingsRef.current)
            }
          }
        )
        // instance1.bind('beforeDrop', function ({ connection }) {
        //   return true
        //   // console.log('beforeDrop', connection)
        //   // console.log(mappings, tempMappingsRef.current)
        //   // if (tempMappingsRef.current) {
        //   //   onChange(tempMappingsRef.current)
        //   // } else if (hasMove.current) {
        //   //   onChange([
        //   //     ...mappings,
        //   //     [
        //   //       connection.endpoints[0].getUuid(),
        //   //       connection.endpoints[1].getUuid(),
        //   //     ],
        //   //   ])
        //   // }
        //   // hasMove.current = false
        //   // tempMappingsRef.current = undefined
        //   // return false
        // })

        instance1.bind('connectionDrag', function (connection: any) {
          hasMove.current = true
          tempMappingsRef.current = undefined

          activeCbRef.current.clear()
          if (connection.floatingIndex === 1) {
            connection.endpoints[0]?.canvas?.classList?.add('checked')
            connection.endpoints[1]?.canvas?.classList?.remove('checked')
          } else if (connection.floatingIndex === 0) {
            connection.endpoints[0]?.canvas?.classList?.remove('checked')
            connection.endpoints[1]?.canvas?.classList?.add('checked')
          }

          connection?.canvas?.classList?.remove('mapping-checked')
        })
        instance1.bind('connectionMoved', function (connection: any) {
          activeCbRef.current.clear()
          // 去掉可能的选中效果
          ;[
            connection.originalSourceEndpoint,
            connection.originalTargetEndpoint,
          ].forEach((point: any) => {
            point?.canvas?.classList.remove('checked')
          })
          connection.canvas?.classList.remove('mapping-checked')

          tempMappingsRef.current = mappingsRef.current!.map(
            ([source, target]) => {
              if (
                source === connection.originalSourceEndpoint.getUuid() &&
                target === connection.originalTargetEndpoint.getUuid()
              ) {
                return [
                  connection.newSourceEndpoint.getUuid(),
                  connection.newTargetEndpoint.getUuid(),
                ]
              }
              return [source, target]
            }
          )
        })
      })

      const activeCbs = activeCbRef.current
      return () => {
        activeCbs!.clear()
        instanceRef.current!.cleanupListeners()

        detachedRef.current = []
        if (instanceRef.current) {
          instanceRef.current!.reset(true)
          // instanceRef.current!.deleteEveryConnection()
          // instanceRef.current!.deleteEveryEndpoint()
          instanceRef.current = undefined
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div {...rest} css={wrapperStyle} ref={ref}>
        <JsplumbContext.Provider
          value={{
            instance,
            addNode,
            // addLeftPoint: addLeftNode,
            // addRightPoint: addRightNode,
          }}
        >
          {children}
        </JsplumbContext.Provider>
      </div>
    )
  }
)

export default MappingContainer
