// declare module '@QCFE/qingcloud-portal-ui'
// declare module '@QCFE/lego-ui'
// import React = require('react')

// // export {}
// declare module '*.svg' {
//   export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
//   const src: string
//   export default src
// }
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
}
declare module '*.png'
