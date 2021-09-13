export {}
declare global {
  interface Window {
    getText(text: string): string
    USER: Record<string, unknown>
  }
}
