import { useState } from 'react'
import { Button, Icon, InputSearch, Form } from '@QCFE/qingcloud-portal-ui'
import { RadioButton } from '@QCFE/lego-ui'
import { FlexBox, Center, DarkModal } from 'components'
import tw, { css, styled } from 'twin.macro'

const { TextField, SelectField, RadioGroupField, TextAreaField } = Form

interface DarkButtonProps {
  variant: 'outlined' | 'default'
}

const DarkButton = styled('button')(({ variant }: DarkButtonProps) => [
  tw`text-white px-3 h-8 inline-flex items-center justify-center space-x-1.5 rounded-sm border`,
  variant === 'outlined' &&
    tw`border-green-12 text-green-13 border rounded-sm hover:text-green-12`,
  variant === 'outlined' &&
    css`
      &:hover {
        background-color: rgba(21, 166, 117, 0.1);
      }
      svg {
        fill: #34d399;
        color: #059669;
      }
    `,
  variant === 'default' && tw`bg-neut-13 border-neut-13 hover:bg-neut-15`,
])

const TableToolBar = () => {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <FlexBox tw="justify-between">
        <Center tw="space-x-3">
          <Button type="primary" onClick={() => setVisible(true)}>
            <Icon name="upload" />
            上传资源
          </Button>
          <DarkButton variant="outlined">
            <Icon name="changing-over" type="light" />
            <span>移动</span>
          </DarkButton>
          <DarkButton variant="default">
            <Icon name="trash" type="light" />
            <span>删除</span>
          </DarkButton>
        </Center>
        <Center tw="space-x-3">
          <InputSearch tw="w-64" placeholder="请输入关键词进行搜索" />
          <DarkButton variant="outlined" tw="px-2">
            <Icon name="if-refresh" tw="text-xl text-white" type="light" />
          </DarkButton>
        </Center>
      </FlexBox>
      <DarkModal
        title="上传资源"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Form>
          <TextField
            name="name"
            label="资源包显示名"
            placeholder="Qingcloud 常规函数"
          />
          <SelectField
            name="region-select"
            label="选择所在目录"
            placeholder="请选择/搜索目标文件夹"
            options={[
              { value: 'pek3', label: '北京 3 区' },
              { value: 'gd1', label: '广东 1 区' },
              { value: 'gd2', label: '广东 2 区' },
              { value: 'sh1', label: '上海 1 区' },
            ]}
          />
          <RadioGroupField label="资源包类型" name="region-radio">
            <RadioButton value="pek3">程序包</RadioButton>
            <RadioButton value="gd1">函数包</RadioButton>
          </RadioGroupField>
          <FlexBox tw="mb-6">
            <div tw="w-24">&nbsp;</div>
            <div>
              <div>程序包用于业务流程中的代码开发模式</div>
              <Center tw="border border-dashed border-green-11 flex-col py-6 space-y-3">
                <Icon name="upload" size="large" />
                <div>单击或拖动文件到此区域进行上传</div>
                <div>
                  仅支持 .jar 格式的文件、大小不超过 1 GB、且仅支持单个上传
                </div>
              </Center>
            </div>
          </FlexBox>
          <TextAreaField
            name="desc"
            label="描述:"
            placeholder="请输入资源包描述"
          />
        </Form>
      </DarkModal>
    </div>
  )
}

export default TableToolBar
