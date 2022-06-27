import {
  Divider,
  HelpCenterLink,
  Modal,
  ModalContent,
  PopConfirm,
} from 'components'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Button, Field, Form, Label } from '@QCFE/lego-ui'
// import tw, { css } from 'twin.macro'
import { useStore } from 'stores/index'
import { useMemberStore } from 'views/Space/Manage/Member/store'
import { observer } from 'mobx-react-lite'
import { useCallback, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import {
  checkboxButtonStyles,
  DisableTextField,
  FormWrapper,
  TextAreaFieldWrapper,
} from 'views/Space/Manage/Member/styled'
import { RoleType } from 'views/Space/Manage/Member/constants'
import { useQueryClient } from 'react-query'
import {
  getMemberKeys,
  useMutationMember,
  useQueryInfiniteMember,
  useQueryRoleList,
} from 'hooks'
import { flatten, get, omit } from 'lodash-es'
import { useDebounce } from 'react-use'

const memberDescPlaceHolder = '请输入成员描述'

const { SelectField } = Form

interface Role {
  id: string
  name: string
  type: number
}

interface IMemberModalProps {
  roleList?: Role[]
  data?: {
    user_id: string
    desc: string
    system_roles: Role[]
  }
  cb?: () => void
}

const MemberModal = observer((props: IMemberModalProps) => {
  const {
    workSpaceStore: { space },
  } = useStore()
  const { op, setOp, spaceItem } = useMemberStore()
  const { roleList: roleListProp, data, cb } = props
  const ref = useRef()
  const [value, setValue] = useImmer({
    user_ids: data ? [data.user_id] : [],
    system_role_ids: data ? data.system_roles.map((i) => i.id) : [],
    desc: data ? data.desc : '',
    user_id: data ? data.user_id : '',
  })

  const { data: roles } = useQueryRoleList(
    { spaceId: spaceItem.id, regionId: spaceItem.regionId },
    {
      enabled: !roleListProp,
    }
  )

  const roleList = roleListProp ?? roles?.infos
  const mutation = useMutationMember()
  const queryClient = useQueryClient()

  const refetch = useCallback(() => {
    queryClient.invalidateQueries(getMemberKeys())
  }, [queryClient])
  const handleOk = useCallback(() => {
    mutation.mutate(
      {
        op,
        ...omit(value, op === 'create' ? 'user_id' : 'user_ids'),
        spaceId: spaceItem.id,
        regionId: (spaceItem as any)?.regionId || undefined,
      },
      {
        onSuccess: () => {
          if (typeof cb === 'function') {
            cb()
          } else {
            refetch()
          }
          setOp('')
        },
      }
    )
  }, [mutation, op, value, spaceItem, cb, refetch, setOp])
  const handleClickRole = (roleId: string) => {
    if (value.system_role_ids.includes(roleId)) {
      setValue((draft) => {
        draft.system_role_ids = draft.system_role_ids.filter(
          (item) => item !== roleId
        )
      })
    } else {
      setValue((draft) => {
        draft.system_role_ids.push(roleId)
      })
    }
  }

  const [filter, setFilter] = useImmer({
    search: '',
  })
  const [search, setSearch] = useState('')

  useDebounce(
    () => {
      setFilter((draft) => {
        draft.search = search
      })
    },
    300,
    [search]
  )

  const {
    status,
    data: memberList,
    fetchNextPage,
    hasNextPage,
  } = useQueryInfiniteMember(filter)
  const options = flatten(
    memberList?.pages?.map((page: Record<string, any>) => page.infos || [])
  ).map((i) => ({ label: i.name, value: i.id }))

  const loadData = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const footer = (
    <div>
      <Button
        key="cancel"
        onClick={() => {
          setOp('')
        }}
      >
        取消
      </Button>
      {op === 'create' ? (
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            handleOk()
          }}
        >
          添加
        </Button>
      ) : (
        <PopConfirm
          key="submit"
          type="warning"
          content={
            <div>
              <div tw="text-neut-15 font-semibold text-base mb-2">
                <span>修改该成员的角色信息</span>
              </div>
              <div tw="text-neut-13 leading-[20px]">
                成员角色信息修改后，所对应的访问权限将会进行变更，您确定修改吗？
              </div>
            </div>
          }
          theme="light"
          onOk={() => {
            handleOk()
          }}
        >
          {/* @ts-ignore */}
          <Button key="submit-btn" type="primary" onClick={null}>
            修改
          </Button>
        </PopConfirm>
      )}
    </div>
  )
  return (
    <Modal
      title={op === 'create' ? '添加成员' : '修改成员'}
      visible
      orient="fullright"
      width={700}
      onCancel={() => {
        setOp('')
      }}
      footer={footer}
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
          {op === 'update' ? (
            <Field name="user_id">
              <Label>成员</Label>
              <DisableTextField>
                <span>{get(data, 'user_info.user_name')}</span>
                <span>{`(${get(data, 'user_id')})`}</span>
              </DisableTextField>
            </Field>
          ) : (
            <SelectField
              label="成员"
              name="user_ids"
              placeholder="请选择或搜索账户名称、邮箱"
              multi
              searchable
              options={options}
              closeOnSelect={false}
              openOnClick
              isLoading={status === 'loading'}
              isLoadingAtBottom
              onMenuScrollToBottom={loadData}
              onInputChange={setSearch}
              bottomTextVisible
              onChange={(arr: string[]) => {
                setValue((draft) => {
                  draft.user_ids = arr
                })
              }}
            />
            // <ArrayInputField
            //   label="成员"
            //   css={css`
            //     &.field .control .input {
            //       ${tw`w-[330px]`}
            //     }
            //   `}
            //   disabled={op === 'update'}
            //   value={value.user_ids}
            //   onChange={(arr: string[]) => {
            //     setValue((draft) => {
            //       draft.user_ids = arr
            //     })
            //   }}
            //   name="userId"
            //   placeholder="请输入成员"
            // />
          )}

          <TextAreaFieldWrapper
            label="成员描述"
            name="desc"
            value={value.desc}
            placeholder={memberDescPlaceHolder}
            onChange={(desc: string) => {
              setValue((draft) => {
                draft.desc = desc
              })
            }}
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
              {(roleList || []).map((item: Record<string, any>) => {
                const checked = value.system_role_ids.includes(item.id)
                return (
                  <Button
                    key={item.id}
                    css={checkboxButtonStyles.wrapper({
                      checked,
                    })}
                    onClick={() => handleClickRole(item.id)}
                  >
                    <Icon
                      name={
                        item.type === RoleType.SpaceAdmin ? 'admin' : 'human'
                      }
                    />
                    {item.name}
                  </Button>
                )
              })}
            </div>
          </Field>
        </FormWrapper>
      </ModalContent>
    </Modal>
  )
})

export default MemberModal
