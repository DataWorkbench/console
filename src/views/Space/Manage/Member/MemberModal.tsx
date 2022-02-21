import {
  ArrayInputField,
  HelpCenterLink,
  Modal,
  ModalContent,
  Divider,
} from 'components'
import { Button, Field, Form, Label } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'
import { useStore } from 'stores/index'
import { useMemberStore } from 'views/Space/Manage/Member/store'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { useImmer } from 'use-immer'

const { TextAreaField } = Form

const memberDescPlaceHolder = '请输入成员描述'

const FormWrapper = styled(Form)(() => [css``])

const DisableTextField = styled.div(() => [
  tw`w-[330px] h-9 bg-neut-1 border-neut-3 border flex p-2 cursor-not-allowed rounded-sm gap-1`,
  css`
    & {
      span:first-of-type {
        ${tw`text-neut-15`}
      }

      span:last-child {
        ${tw`text-neut-8`}
      }
    }
  `,
])

const TextAreaFieldWrapper = styled(TextAreaField)(() => [
  css`
    & {
      textarea.textarea {
        ${tw`min-w-[550px] min-h-[84px] w-auto`}
      }
    }
  `,
])

const MemberModal = observer(() => {
  const {
    workSpaceStore: { space },
  } = useStore()
  const { setOp } = useMemberStore()
  const ref = useRef()
  console.log(2222, space)
  const [value, setValue] = useImmer({
    users: [''] as string[],
    roles: [] as string[],
    desc: '',
  })
  return (
    <Modal
      title="添加成员"
      visible
      orient="fullright"
      width={700}
      onOk={() => {
        setOp('')
      }}
      onCancel={() => {
        setOp('')
      }}
    >
      <ModalContent>
        <FormWrapper tw="max-w-full!" layout="vertical" ref={ref}>
          <Field name="spaceId">
            <Label>所属空间</Label>
            <DisableTextField>
              <span>{space?.name}</span>
              <span>{`(${space?.id})`}</span>
            </DisableTextField>
          </Field>
          <ArrayInputField
            label="成员"
            css={css`
              &.field .control .input {
                ${tw`w-[330px]`}
              }
            `}
            value={value.users}
            onChange={(arr: string[]) => {
              setValue((draft) => {
                draft.users = arr
              })
            }}
            name="userId"
            placeholder="请输入成员"
          />

          <TextAreaFieldWrapper
            label="成员描述"
            name="desc"
            placeholder={memberDescPlaceHolder}
          />
          <Field>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="label" htmlFor="###">
              角色
            </label>
            <div className="help">
              <span>
                不同的角色拥有不同的操作权限，把角色授予成员后，成员即具有了角色的所有权限。每位成员至少要拥有一个角色，并且可以同时拥有多种角色。
              </span>
              <HelpCenterLink isIframe={false}>角色权限详情</HelpCenterLink>
            </div>
            <Divider tw="mt-4 mb-4" />
            <div tw="flex gap-3">
              <Button>空间管理员</Button>
              <Button>空间管理员</Button>
            </div>
          </Field>
        </FormWrapper>
      </ModalContent>
    </Modal>
  )
})

export default MemberModal
