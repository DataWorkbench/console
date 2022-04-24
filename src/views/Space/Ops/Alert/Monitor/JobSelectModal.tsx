import { Modal, ModalContent, SelectTreeTable } from 'components/index'
import { useColumns } from 'hooks/useHooks/useColumns'
import { jobColumns } from 'views/Space/Ops/Alert/common/constants'
import { jobFieldMapping, Mapping } from 'views/Space/Ops/Alert/common/mapping'

type MappingKey<T> = T extends Mapping<infer U> ? U : never
const getName = (name: MappingKey<typeof jobFieldMapping>) =>
  jobFieldMapping.get(name)!.apiField

const jobSelectModalSetting = 'JOB_SELECT_MODAL'
const JobSelectModal = () => {
  const columnsRender = {
    [getName('name')]: (text: string) => {
      return <span>{text}</span>
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
      width={800}
      // onOk={onCancel}
      // onCancel={onCancel}
      title="绑定数据集成作业"
      appendToBody
    >
      <ModalContent>
        <SelectTreeTable
          columns={columns}
          dataSource={[]}
          getChildren={() => []}
        />
      </ModalContent>
    </Modal>
  )
}

export default JobSelectModal
