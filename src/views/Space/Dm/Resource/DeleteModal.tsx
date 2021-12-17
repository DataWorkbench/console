import { Button, Icon, Table } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Modal, Icons, Tooltip, Center } from 'components'
import { useState } from 'react'
import { css } from 'twin.macro'
import { PackageName } from './constants'

export default function DeleteModal(props: any) {
  const {
    visible,
    packageType,
    toggle,
    mutation,
    deleteData: { value: selectedList = [] },
    success,
  } = props

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = () => {
    mutation.mutate(
      {
        op: 'delete',
        resourceIds: Array.from(selectedList, (el: any) => el.resource_id),
      },
      {
        onSuccess: async () => {
          success()
        },
      }
    )
  }

  const columns = [
    {
      title: `${PackageName[packageType]}名称`,
      dataIndex: 'name',
      render: (_: string, row: Record<string, any>) => {
        return (
          <FlexBox tw="items-center space-x-1">
            {packageType === 'dependency' ? (
              <Icons name="dependency" width={20} size={20} />
            ) : (
              <Icon
                tw="w-5! h-5!"
                name={packageType === 'program' ? 'coding' : 'terminal'}
                type="light"
                color={{
                  primary: '#219861',
                  secondary: '#8EDABD',
                }}
              />
            )}
            <Tooltip content={<Center tw="p-3">{row.name}</Center>}>
              <div tw="max-w-[130px] truncate">{row.name}</div>
            </Tooltip>
          </FlexBox>
        )
      },
    },
    {
      title: 'ID',
      dataIndex: 'resource_id',
      render: (value: string) => <div tw="text-neut-8">{value}</div>,
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      render: (value: number) => <>{Math.round(value / 1024)}kb</>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      render: (value: string) => {
        return (
          <Tooltip content={<Center tw="p-3 break-all">{value}</Center>}>
            <div tw="max-w-[150px] truncate text-neut-8">{value}</div>
          </Tooltip>
        )
      },
    },
  ]

  return (
    <Modal
      noBorder
      visible={visible}
      width={selectedList?.length > 1 ? 800 : 400}
      onCancel={toggle}
      confirmLoading={mutation.isLoading}
      okText="删除"
      footer={
        <FlexBox tw="justify-end">
          <Button onClick={toggle}>取消</Button>
          <Button
            type="danger"
            loading={mutation.isLoading}
            onClick={handleDelete}
          >
            删除
          </Button>
        </FlexBox>
      }
    >
      <FlexBox tw="space-x-3 mb-3">
        <Icon
          name="if-exclamation"
          css={css`
            color: #ffd127;
            font-size: 22px;
            line-height: 24px;
          `}
        />
        <section tw="flex-1">
          {(() => {
            const deleteTitle =
              selectedList.length === 1 ? (
                <>
                  删除{PackageName[packageType]}
                  {selectedList[0].name}({selectedList[0].resource_id})注意事项
                </>
              ) : (
                <>
                  删除以下{selectedList.length}个{PackageName[packageType]}
                  注意事项
                </>
              )
            return (
              <>
                <div tw="font-medium mb-2 text-base">{deleteTitle}</div>
                <div className="modal-content-message" tw="text-neut-8">
                  {packageType === 'program' &&
                    (selectedList.length > 1 ? (
                      <>
                        删除以下程序包后，代码开发模式下将无法引用相关 Jar
                        包，不影响已运行的作业实例，但重新运行相关作业时会报错，且该操作无法撤回。确认删除吗？
                      </>
                    ) : (
                      <>
                        删除程序包{selectedList[0].name}(
                        {selectedList[0].resource_id}
                        后，代码开发模式下将无法引用此 Jar
                        包，不影响已运行的作业实例，但重新运行相关作业时会报错，且该操作无法撤回。确认删除吗？
                      </>
                    ))}
                  {packageType === 'function' &&
                    (selectedList.length > 1 ? (
                      <>
                        函数包删除后，相关作业将无法引用，已引用的作业将受到影响，且该操作无法撤回。确认删除吗？
                      </>
                    ) : (
                      <>
                        删除函数包{selectedList[0].name}(
                        {selectedList[0].resource_id}
                        )后，相关作业将无法引用，已引用的作业将受到影响，且该操作无法撤回。确认删除吗？
                      </>
                    ))}
                  {packageType === 'dependency' &&
                    (selectedList.length > 1 ? (
                      <>
                        删除以下依赖包后，具体文案待确认具体文案待确认具体文案待确认具体文案待确认具体文案待确认具体文案待确认，且该操作无法撤回。确认删除吗？
                      </>
                    ) : (
                      <>
                        删除依赖包{selectedList[0].name}(
                        {selectedList[0].resource_id}
                        )后，具体文案待确认具体文案待确认具体文案待确认具体文案待确认，且该操作无法撤回。确认删除吗？
                      </>
                    ))}
                </div>
              </>
            )
          })()}
        </section>
      </FlexBox>
      <>
        {selectedList?.length > 1 && (
          <Table
            dataSource={selectedList.slice(
              (page - 1) * pageSize,
              page * pageSize
            )}
            rowKey="resource_id"
            columns={columns}
            pagination={{
              total: selectedList.length,
              current: page,
              pageSize,
              onPageChange: (current: number) => {
                setPage(current)
              },
              onShowSizeChange: (size: number) => {
                setPageSize(size)
              },
            }}
          />
        )}
      </>
    </Modal>
  )
}
