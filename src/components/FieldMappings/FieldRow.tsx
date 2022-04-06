import { Icon, Input, Select } from '@QCFE/lego-ui'
import { Center } from 'components/Center'
import { FlexBox } from 'components/Box'
import { TMappingField } from './MappingItem'
import { fieldTypeMapper } from './constant'

interface FieldRowProps {
  field: TMappingField
}

const FieldRow = ({ field }: FieldRowProps) => {
  if (field.custom && field.default === '') {
    return (
      <>
        <div>
          <Select
            placeholder="字段类型"
            options={fieldTypeMapper
              .get('MySQL')
              ?.map((v) => ({ label: v, value: v }))}
          />
        </div>
        <FlexBox tw="items-center">
          <Input type="text" placeholder="请输入字段名" tw="w-auto flex-1" />
          <Center tw="w-20 gap-2.5">
            <Icon name="close" type="light" clickable />
            <Icon name="check" type="light" clickable />
          </Center>
        </FlexBox>
      </>
    )
  }
  return (
    <>
      <div>{field.type}</div>
      <div>{field.name}</div>
    </>
  )
}

export default FieldRow
