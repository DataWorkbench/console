import tw, { styled, css } from 'twin.macro'
import { useRef, useCallback } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useImmer } from 'use-immer'
import { DarkModal } from './Modal'

interface ResizeModalProps {
  minWidth?: number
  maxWidth: number
  children: React.ReactChild
  enableResizing: ColResizeProp
  [k: string]: any
}
export interface ColResizeProp {
  right?: boolean
  left?: boolean
}

const Modal = styled(DarkModal)(() => [
  css`
    .col_resize {
      cursor: col-resize;
    }
  `
])
const ColResize = styled.div(({ right, left }: ColResizeProp) => [
  tw`absolute w-2! h-full top-0`,
  right && tw` right-[-5px]`,
  left && tw` left-[-5px]`
])

const ResizeModal = (props: ResizeModalProps) => {
  const { maxWidth, minWidth = 800, children, enableResizing, width = 1000, ...rest } = props
  const isResize = useRef(false)
  const clientX = useRef(0)
  const [modalWidth, setModalWidth] = useImmer(width)

  const mouseUp = useCallback((e: MouseEvent) => {
    e.preventDefault()
    isResize.current = false
  }, [])

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      if (isResize.current) {
        const value = clientX.current - e.clientX + modalWidth
        if (value >= maxWidth || value <= minWidth) return
        setModalWidth(value)
      }
    },
    [maxWidth, minWidth, modalWidth, setModalWidth]
  )

  const down = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    isResize.current = true
    clientX.current = e.clientX
  }, [])

  const clearEvent = useCallback(() => {
    document.body.removeEventListener('mousemove', mouseMove)
    document.body.removeEventListener('mouseup', mouseUp)
  }, [mouseMove, mouseUp])

  useMount(() => {
    document.body.addEventListener('mousemove', mouseMove)
    document.body.addEventListener('mouseup', mouseUp)
  })

  useUnmount(() => {
    clearEvent()
  })

  return (
    <Modal {...rest} width={modalWidth}>
      <ColResize {...enableResizing} className="col_resize" onMouseDown={down} />
      {children}
    </Modal>
  )
}

export { ResizeModal }
