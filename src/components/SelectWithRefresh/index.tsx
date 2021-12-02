import { css, styled } from 'twin.macro'
import { Select, Button, Form } from '@QCFE/lego-ui'

import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useState } from 'react'

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
const SelectWithRefresh = (props: ISelectWithRefreshProps) => {
  const { onRefresh, onChange, help, labelClassName, label, ...rest } = props
  const [domId] = useState(Math.random().toString(32))
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

export default (Form as any).getFormField(SelectWithRefresh)
