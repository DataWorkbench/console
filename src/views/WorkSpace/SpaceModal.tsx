import { useRef, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css } from 'twin.macro'
import { RadioButton, Form, Input, Button } from '@QCFE/lego-ui'
import { Icon, Table } from '@QCFE/qingcloud-portal-ui'
import { Modal, ModalContent, RouterLink } from 'components'
import { useQueryClient } from 'react-query'
import { useWorkSpaceContext } from 'contexts'
import { formatDate, strlen, nameMatchRegex } from 'utils/convert'
import { useMutationWorkSpace, getWorkSpaceKey } from 'hooks'

const { TextField, RadioGroupField, TextAreaField } = Form

const columns = [
  {
    title: '空间名称/ID',
    width: 220,
    dataIndex: 'id',
    render: (field: string, row: any) => (
      <div tw="flex items-center w-full">
        <div tw="bg-neut-3 rounded-full p-1 flex items-center justify-center">
          <Icon name="project" size="small" />
        </div>
        <div tw="ml-2 overflow-hidden">
          <div tw="font-semibold truncate">{row.name}</div>
          <div tw="text-neut-8">{field}</div>
        </div>
      </div>
    ),
  },
  {
    title: '空间状态',
    width: 100,
    dataIndex: 'status',
    render: (field: number) => (
      <div
        css={[
          field === 1
            ? tw`bg-green-0 text-green-13`
            : tw`bg-[#FFFDED] text-[#A16207]`,
          tw`px-2 py-0.5 rounded-[20px] flex items-center`,
        ]}
      >
        <div
          css={[
            field === 1 ? tw`bg-green-1` : tw`bg-[#FFD127]`,
            tw`w-3 h-3 rounded-full flex items-center justify-center mr-1`,
          ]}
        >
          <div
            css={[
              field === 1 ? tw`bg-green-13` : tw`bg-[#A48A19]`,
              tw`w-1.5 h-1.5 rounded-full`,
            ]}
          />
        </div>
        {field === 1 ? '活跃' : '已禁用'}
      </div>
    ),
  },
  { title: '空间所有者', dataIndex: 'owner' },
  {
    title: '创建时间',
    dataIndex: 'created',
    render: (field: number) => formatDate(field),
  },
]

interface SpaceModalProps {
  onHide?: () => void
  [propName: string]: unknown
}

const SpaceModal = observer(
  ({ region, onHide, ...otherProps }: SpaceModalProps) => {
    const stateStore = useWorkSpaceContext()
    const [delBtnEnable, setDelBtnEnable] = useState(true)
    const { curSpaceOpt, optSpaces, cardView } = stateStore
    const curSpace = optSpaces.length ? optSpaces[0] : null
    const form = useRef<Form>(null)
    const mutation = useMutationWorkSpace()
    const queryClient = useQueryClient()
    const regionId = region.id
    const filterOptSpaces = optSpaces.filter((o) => {
      if (curSpaceOpt === 'enable' && o.status !== 2) {
        return false
      }
      if (curSpaceOpt === 'disable' && o.status !== 1) {
        return false
      }
      return true
    })
    const filterOptSpaceIds = filterOptSpaces.map((o) => o.id)

    useEffect(() => {
      setDelBtnEnable(stateStore.curSpaceOpt !== 'delete')
    }, [stateStore.curSpaceOpt])

    const handleModalClose = () => {
      setDelBtnEnable(true)
      stateStore.set({ curSpaceOpt: '' })
      if (onHide) {
        onHide()
      }
    }

    const handleOk = () => {
      let params
      if (['create', 'update'].includes(curSpaceOpt)) {
        if (form.current?.validateForm()) {
          const fields = form.current.getFieldsValue()
          params = {
            regionId,
            op: curSpaceOpt,
            ...fields,
          }
          if (curSpaceOpt === 'update') {
            params.spaceId = curSpace.id
          }
        }
      } else if (['disable', 'enable', 'delete'].includes(curSpaceOpt)) {
        if (filterOptSpaceIds.length > 0) {
          params = {
            regionId,
            op: curSpaceOpt,
            spaceIds: filterOptSpaceIds,
          }
        } else {
          handleModalClose()
          // stateStore.set({ curSpaceOpt: '' })
        }
      }
      if (params) {
        mutation.mutate(params, {
          onSuccess: async () => {
            handleModalClose()
            // stateStore.set({ curSpaceOpt: '' })
            const queryKey = getWorkSpaceKey(cardView ? 'infinite' : 'page')
            await queryClient.invalidateQueries(queryKey)
            stateStore.set({ optSpaces: [] })
          },
        })
      }
    }

    if (['enable', 'disable', 'delete'].includes(curSpaceOpt)) {
      const operateObj: any = {
        enable: {
          opName: '启动',
          desc: '是否确认启用工作空间？',
        },
        disable: {
          opName: '禁用',
          desc: (
            <>
              <div>
                <b>作业实例: </b>工作空间内正在运行的作业实例不会强制停止。
              </div>
              <div tw="mb-3">
                <b>计算集群: </b>
                不会自动停用计算集群（集群继续计费），若需要停用集群，需手动操作。前往
                <RouterLink
                  to={`/${regionId}/workspace/${filterOptSpaceIds[0]}/dm/cluster`}
                  color="blue"
                >
                  计算集群
                </RouterLink>
              </div>
              <div>是否确认禁用工作空间？</div>
            </>
          ),
        },
        delete: {
          opName: '删除',
          desc: '该工作空间删除后无法恢复，请谨慎操作。',
        },
      }
      const { opName, desc } = operateObj[curSpaceOpt]
      return (
        <Modal
          visible
          noBorder
          width={filterOptSpaceIds.length > 1 ? 720 : 400}
          onCancel={handleModalClose}
          footer={
            <>
              <Button onClick={handleModalClose}>
                {window.getText('LEGO_UI_CANCEL')}
              </Button>
              <Button
                type={curSpaceOpt === 'enable' ? 'primary' : 'danger'}
                disabled={!delBtnEnable}
                loading={mutation.isLoading}
                onClick={handleOk}
              >
                {opName}
              </Button>
            </>
          }
        >
          <div tw="flex items-start">
            <Icon
              name={curSpaceOpt === 'enable' ? 'information' : 'if-error-info'}
              size={curSpaceOpt === 'enable' ? 24 : 'medium'}
              css={[
                tw`mr-3 text-2xl leading-6`,
                curSpaceOpt === 'enable'
                  ? css`
                      svg {
                        ${tw`text-white fill-[#2193D3]`}
                      }
                    `
                  : tw`text-red-10`,
              ]}
            />
            <div tw="flex-1 overflow-hidden">
              <div tw="font-semibold text-base text-neut-15 break-all">
                {filterOptSpaces.length === 1
                  ? `${opName}工作空间 ${filterOptSpaces[0].name} `
                  : `${opName}以下 ${filterOptSpaces.length} 个工作空间`}
              </div>
              <div tw="text-neut-13 mt-2">
                <div tw="mb-2">{desc}</div>
                {filterOptSpaces.length > 1 && (
                  <div tw="space-y-3">
                    <Table
                      dataSource={filterOptSpaces}
                      columns={columns}
                      rowKey="id"
                    />
                  </div>
                )}
                {curSpaceOpt === 'delete' && (
                  <div tw="pt-6 space-y-1">
                    <div>
                      <span tw="text-red-10">*</span>
                      请在下方输入框中输入&quot;{filterOptSpaces[0].name}
                      &quot;以确认操作
                    </div>
                    <div>
                      <Input
                        autoComplete="off"
                        type="text"
                        tw="w-40"
                        placeholder={filterOptSpaces[0].name}
                        onChange={(e, value) =>
                          setDelBtnEnable(value === filterOptSpaces[0].name)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )
    }

    return (
      <Modal
        title={`${curSpaceOpt === 'create' ? '创建' : '修改'}工作空间`}
        closable
        visible
        width={800}
        orient="fullright"
        onOk={handleOk}
        onCancel={handleModalClose}
        {...otherProps}
        confirmLoading={mutation.isLoading}
        okText={curSpaceOpt === 'create' ? '创建' : '修改'}
        cancelText="取消"
      >
        <ModalContent>
          <Form ref={form} layout="vertical" style={{ maxWidth: '450px' }}>
            {curSpaceOpt === 'create' && (
              <RadioGroupField
                name="regionId"
                label="区域"
                defaultValue={regionId}
              >
                <RadioButton value={regionId}>
                  <Icon name="zone" />
                  {region.name}
                </RadioButton>
              </RadioGroupField>
            )}
            <TextField
              name="name"
              autoComplete="off"
              label="工作空间名称"
              validateOnChange
              placeholder="字母、数字或下划线（_）"
              labelClassName="medium"
              schemas={[
                {
                  rule: {
                    required: true,
                    matchRegex: nameMatchRegex,
                  },
                  help: '字母、数字或下划线（_）,不能以（_）开始结尾',
                  status: 'error',
                },
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l >= 2 && l <= 128
                  },
                  help: '最小长度2,最大长度128',
                  status: 'error',
                },
              ]}
              defaultValue={curSpaceOpt === 'create' ? '' : curSpace.name}
            />
            <TextAreaField
              name="desc"
              label="工作空间描述"
              placeholder="请填写工作空间的描述"
              rows="5"
              validateOnChange
              schemas={[
                {
                  rule: (value: string) => strlen(value) <= 1024,
                  help: '超过最大长度1024字节',
                  status: 'error',
                },
              ]}
              defaultValue={
                curSpaceOpt === 'create' ? '' : curSpace.desc || '暂无描述'
              }
            />
          </Form>
        </ModalContent>
      </Modal>
    )
  }
)

export default SpaceModal
