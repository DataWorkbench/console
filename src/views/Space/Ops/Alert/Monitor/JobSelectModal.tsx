/* eslint-disable no-underscore-dangle */
import { Icons, Modal, ModalContent, SelectTreeTable } from 'components/index'
import { useColumns } from 'hooks/useHooks/useColumns'
import { jobColumns } from 'views/Space/Ops/Alert/common/constants'
import { jobFieldMapping, Mapping } from 'views/Space/Ops/Alert/common/mapping'

type MappingKey<T> = T extends Mapping<infer U> ? U : never
const getName = (name: MappingKey<typeof jobFieldMapping>) =>
  jobFieldMapping.get(name)!.apiField

const jobSelectModalSetting = 'JOB_SELECT_MODAL'

interface IJobSelectProps {
  onCancel: () => void
}

const datasource = [
  {
    id: '111',
    name: 'hahaha',
    isFileBox: Math.random() > 0.2,
    type: 1,
  },
  {
    id: '222',
    name: 'xxx',
    isFileBox: Math.random() > 0.1,
    type: 2,
  },
]
const JobSelectModal = (props: IJobSelectProps) => {
  const { onCancel } = props
  const columnsRender = {
    [getName('name')]: {
      render: (text: string, record: Record<string, any>) => {
        console.log(222, record)
        if (record.__level === 1 && record.type === 1) {
          return (
            <span>
              <Icons name="EqualizerFill" size={16} tw="mr-2" />
              {text}
            </span>
          )
        }
        if (record.__level === 1 && record.type === 2) {
          return (
            <span>
              <Icons name="EventFill" size={16} tw="mr-2" />
              {text}
            </span>
          )
        }

        if (!record.isFileBox) {
          return (
            <span>
              <Icons name="DownloadBoxFill" size={16} tw="mr-2" />
              {text}
            </span>
          )
        }
        return (
          <span>
            <Icons name="FolderFill" size={16} tw="mr-2" />
            {text}
          </span>
        )
      },
    },
  }

  const { columns } = useColumns(
    jobSelectModalSetting,
    jobColumns,
    columnsRender
  )
  return (
    <Modal
      visible
      width={1200}
      onOk={onCancel}
      onCancel={onCancel}
      title="绑定数据集成作业"
      appendToBody
    >
      <ModalContent>
        <SelectTreeTable
          columns={columns}
          dataSource={datasource}
          rowKey="id"
          selectedLevel={10}
          showItemCheckboxFn={(record) => {
            return !!record.isFileBox
          }}
          getChildren={async (key) => [
            {
              id: `${key}-child`,
              name: 'hahaha',
              isFileBox: Math.random() > 0.5,
            },
            {
              id: `${key}-child2`,
              name: 'xxx',
              isFileBox: Math.random() > 0.3,
            },
          ]}
        />
      </ModalContent>
    </Modal>
  )
}

export default JobSelectModal
