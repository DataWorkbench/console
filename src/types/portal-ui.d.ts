declare module '@QCFE/qingcloud-portal-ui' {
  import type { Message as MessageType } from '@QCFE/lego-ui'

  type Zone =
    | 'ap3'
    | 'ap2a'
    | 'beta'
    | 'ehpc'
    | 'ehpca'
    | 'nscc'
    | 'nscca'
    | 'pek3'
    | 'pek3a'
    | 'pek3b'
    | 'pek3c'
    | 'pek3d'
    | 'sh1'
    | 'sh3'
    | 'sh3b'
    | 'staging'
    | 'staging3'
    | 'gd2'
    | 'test'

  interface ConfigUtils {
    getZoneTitle: (zone: Zone) => string
  }

  export * from '@QCFE/lego-ui'

  export const Message: MessageType
  export const configUtils: ConfigUtils
  export const Modal: Modal
  export const HelpCenterModal: JSX.Element
  export const localstorage

  export function PortalProvider(props: any): JSX.Element
  export function PortalCollapsePanel(props: any): JSX.Element
  export function PortalLocaleProvider(props: any): JSX.Element
  export function GlobalNav(props: any): JSX.Element
  export function SideMenu(props: any): JSX.Element
  export function PageTab(props: any): JSX.Element
  export function ToolBar(props: any): JSX.Element
  export function Divider(props: any): JSX.Element
  export function ToolBarLeft(props: any): JSX.Element
  export function ToolBarRight(props: any): JSX.Element

  export interface ModalProps {
    css?: Record<string, Record<string, unknown>>
    width?: number
    height?: number
    onCancel?: () => void
    onOk?: () => void
    title?: string
    visible?: boolean
    className?: string
    appendToBody?: boolean
    bodyStyle?: Record<string, string | number>
    children?: JSX.Element | JSX.Element[]
    footer?: React.ReactNode | string | null
    okType?: string
    okText?: string
    cancelType?: string
    confirmLoading?: boolean
    showConfirmLoading?: boolean
    draggable?: boolean
    resizable?: boolean
    maskClosable?: boolean
    cancelText?: string
    escClosable?: boolean
  }

  export interface Modal {
    (props: ModalProps): JSX.Element
    open(modal: JSX.Element, props?: unknown): JSX.Element
    close(modal: JSX.Element, props?: unknown): JSX.Element
  }
}
