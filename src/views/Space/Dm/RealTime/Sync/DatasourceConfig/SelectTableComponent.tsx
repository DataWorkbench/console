// import { RadioButton, RadioGroup } from "@QCFE/lego-ui";
// import { PopConfirm } from "components/PopConfirm";
// import React from "react";
// import { FlexBox, } from 'components'
//
// const SelectTableComponent = (props) => {
//   const { width, className,  } = props
//   const [value, setValue] =
//   return (
//     <div className={className} tw="flex-auto" style={{ width }}>
//       <FlexBox tw="mb-1">
//         <RadioGroup
//           value={value?.type}
//           onChange={hasChange ? undefined : handleTypeChange}
//           style={{ marginBottom: 0 }}
//         >
//           {types.map((item) => {
//             if (!hasChange) {
//               return (
//                 <RadioButton key={item.value} value={item.value}>
//                   {item.label}
//                 </RadioButton>
//               )
//             }
//             return (
//               <PopConfirm
//                 content={<div>切换输入模式会清空已输入内容，确认切换？</div>}
//                 type="warning"
//                 onOk={() => handleTypeChange(item.value)}
//               >
//                 <RadioButton key={item.value} value={item.value}>
//                   {item.label}
//                 </RadioButton>
//               </PopConfirm>
//             )
//           })}
//         </RadioGroup>
//       </FlexBox>
//     </div>
//   )
// }
//
// export default SelectTableComponent
