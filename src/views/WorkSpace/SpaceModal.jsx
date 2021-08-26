import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'
import { RadioButton, Form, Icon } from '@QCFE/lego-ui'
import { get } from 'lodash'
import Modal, { ModalContent } from 'components/Modal'
import { useStore } from 'stores'
import { useWorkSpaceContext } from 'contexts'

const { TextField, RadioGroupField, TextAreaField } = Form

function SpaceModal({ region, onHide, ...otherProps }) {
  const stateStore = useWorkSpaceContext()
  const { curSpaceOpt, optSpaces } = stateStore
  const curSpace = get(optSpaces, '0')
  const form = useRef(null)
  const {
    workSpaceStore,
    workSpaceStore: { loadStatus },
  } = useStore()
  const { id: regionId } = region
  const handleOk = () => {
    if (form.current.validateForm()) {
      const fields = form.current.getFieldsValue()
      if (curSpaceOpt === 'create') {
        workSpaceStore.create({ ...fields, regionId }).then(() => onHide(true))
      } else {
        workSpaceStore
          .update({
            ...fields,
            regionId,
            spaceId: curSpace.id,
          })
          .then(() => onHide(true))
      }
    }
  }

  return (
    <Modal
      title={`${curSpaceOpt === 'create' ? '创建' : '修改'}工作空间`}
      closable
      placement="rightFull"
      onOK={handleOk}
      onHide={() => onHide(false)}
      {...otherProps}
      showConfirmLoading={loadStatus?.state === 'pending'}
      okText={curSpaceOpt === 'create' ? '创建' : '修改'}
      cancelText="取消"
    >
      <ModalContent>
        <Form ref={form} layout="vertical" style={{ maxWidth: '450px' }}>
          <RadioGroupField name="regionId" label="区域" defaultValue={regionId}>
            <RadioButton value={regionId}>
              <Icon name="zone" />
              {region.name}
            </RadioButton>
          </RadioGroupField>
          <TextField
            name="name"
            label="工作空间名称"
            validateOnChange
            placeholder="中文、字母、数字或下划线（_）"
            labelClassName="medium"
            schemas={[
              {
                rule: {
                  required: true,
                  matchRegex: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                },
                help: '中文、字母、数字或下划线（_）,不能以（_）开结尾',
                status: 'error',
              },
              {
                rule: {
                  minLength: 2,
                  maxLength: 128,
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
                rule: {
                  maxLength: 1024,
                },
                help: '超过最大长度1024字节',
                status: 'error',
              },
            ]}
            defaultValue={curSpaceOpt === 'create' ? '' : curSpace.desc}
          />
        </Form>
      </ModalContent>
    </Modal>
  )
}

SpaceModal.propTypes = {
  onHide: PropTypes.func,
  region: PropTypes.object,
  className: PropTypes.string,
}
SpaceModal.defaultProps = {
  onHide() {},
}

export default observer(SpaceModal)
