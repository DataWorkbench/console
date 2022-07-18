import { Table, Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css } from 'twin.macro'
import { FlexBox } from 'components/Box'
import { Global } from '@emotion/react'
import { ModalWrapper, OwnerWrapper } from './styled'

interface IMemberDeleteModal {
  data: Record<string, any>[]
  columns: Record<string, any>[]
  onClose: () => void
  onOk: () => void
}

const MemberDeleteModal = (props: IMemberDeleteModal) => {
  const { data, columns, onClose, onOk } = props
  const justOne = data.length === 1

  return (
    <ModalWrapper
      visible
      width={justOne ? 400 : 800}
      onOk={onOk}
      onCancel={onClose}
      okText="移除"
      okType="danger"
    >
      <Global styles={OwnerWrapper.isOwner({ isOwner: false })} />
      <FlexBox tw="gap-3">
        <div>
          <Icon name="exclamation" color={{ secondary: '#F5C414', primary: 'white' }} size={24} />
        </div>
        <div tw="flex-auto">
          <div tw="text-neut-15 font-semibold text-base mb-2">
            {justOne ? `确定要将成员 (${data[0].user_id}) 移除吗？` : '确定要将以下成员移除吗？'}
          </div>
          <div tw="text-neut-13 leading-[20px] mb-3">
            成员移除后将无法访问该空间所有数据信息，正在运行的任务不会停止，请谨慎操作。
          </div>
          {!justOne && (
            <Table
              css={[
                css`
                  ${tw`mb-4`}
                  & .add-member-item {
                    ${tw`hidden`}
                  }
                `,
                OwnerWrapper.isOwner({ isOwner: false })
              ]}
              dataSource={data}
              columns={columns}
              rowKey="user_id"
              pagination={false}
            />
          )}
        </div>
      </FlexBox>
    </ModalWrapper>
  )
}

export default MemberDeleteModal
