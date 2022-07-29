export {}
declare global {
  interface Window {
    getText(text: string): string
    USER: any
  }

  interface IUseParams {
    regionId: string
    spaceId: string
    [k: string]: string
  }

  type OP =
    | ''
    | 'create'
    | 'edit'
    | 'delete'
    | 'update'
    | 'enable'
    | 'disable'
    | 'start'
    | 'stop'
    | 'view'
    | 'detail'
    | 'reload'
    | 'restart'
}
