import { css, styled } from 'twin.macro'
import { Select, Button, Form } from '@QCFE/lego-ui'

import { Icon } from '@QCFE/qingcloud-portal-ui'
import { ReactElement, useState, forwardRef, useImperativeHandle } from 'react'

const SelectWithRefreshBox = styled('div')(() => [
  css`
    .qicon {
      color: #fff;
    }
  `,
])
interface ISelectWithRefreshProps {
  onRefresh: () => void
  [propName: string]: any
}
const SelectWithRefreshCmp = forwardRef(
  (props: ISelectWithRefreshProps, ref: any) => {
    const { onRefresh, onChange, help, labelClassName, label, ...rest } = props
    const [domId] = useState(Math.random().toString(32))
    useImperativeHandle(ref, () => ({}))
    return (
      <SelectWithRefreshBox>
        <>
          <Select {...rest} id={domId} onChange={onChange} />
          <Button tw="w-8 ml-3 p-0">
            <Icon
              name="refresh"
              tw="text-xl  text-white"
              size={20}
              onClick={() => onRefresh && onRefresh()}
            />
          </Button>
        </>
      </SelectWithRefreshBox>
    )
  }
)

export const SelectWithRefresh: (p: ISelectWithRefreshProps) => ReactElement = (
  Form as any
).getFormField(SelectWithRefreshCmp)

export default SelectWithRefresh
