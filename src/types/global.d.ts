export {}
declare global {
  interface Window {
    getText(text: string): string
    USER: any
  }

  interface IUseParms {
    regionId: string
    spaceId: string
    [k: string]: string
  }
}
