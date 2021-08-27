import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'
import { RadioButton, Form, Icon, Input, Button, Modal } from '@QCFE/lego-ui'
import { get } from 'lodash'
import FullModal, { ModalContent } from 'components/Modal'
import { useStore } from 'stores'
import { useWorkSpaceContext } from 'contexts'
import styles from './styles.module.css'

const { TextField, RadioGroupField, TextAreaField } = Form

const styleObj = {
  error: {
    icon: 'if-error-info',
    color: '#cf3b37',
    okType: 'danger',
  },
  warn: {
    icon: 'if-exclamation',
    color: '#FFD127',
    okType: 'primary',
  },
}

function SpaceModal({ region, onHide, ...otherProps }) {
  const stateStore = useWorkSpaceContext()
  const [delBtnEnable, setDelBtnEnable] = useState(true)
  const { curSpaceOpt, optSpaces, optSpaceIds, optSpacesNames } = stateStore
  const curSpace = optSpaces.length ? optSpaces[0] : null
  const form = useRef(null)
  const {
    workSpaceStore,
    workSpaceStore: { loadStatus },
  } = useStore()
  const regionId = region.id

  useEffect(() => {
    setDelBtnEnable(stateStore.curSpaceOpt !== 'delete')
  }, [stateStore.curSpaceOpt])

  const handleModalClose = (v) => {
    setDelBtnEnable(true)
    onHide(v)
  }

  const handleOk = () => {
    if (form.current.validateForm()) {
      const fields = form.current.getFieldsValue()
      if (curSpaceOpt === 'create') {
        workSpaceStore
          .create({ ...fields, regionId })
          .then(() => handleModalClose(true))
      } else {
        workSpaceStore
          .update({
            ...fields,
            regionId,
            spaceId: curSpace.id,
          })
          .then(() => handleModalClose(true))
      }
    }
  }

  if (['enable', 'disable', 'delete'].includes(curSpaceOpt)) {
    const operateObj = {
      enable: {
        opName: '启动',
        desc: '启用该工作空间，下属服务也将被启用，是否确认该工作空间进行启用操作？',
        style: styleObj.warn,
      },
      disable: {
        opName: '禁用',
        desc: '工作空间内正在运行的任务不会强制停止，已发布调度未运行的任务将不会运行。成员无法登录，是否确认进行禁用操作？',
        style: styleObj.warn,
      },
      delete: {
        opName: '删除',
        desc: (
          <div className="tw-space-y-3">
            <div>
              该工作空间内工作流、成员等数据都将彻底删除，无法恢复，请谨慎操作。
            </div>
            <div className="tw-border-t tw-border-neut-2" />
            <div>
              *请在下方输入框中输入 “{get(optSpaceIds, '0')}” 以确认操作
            </div>
            <div>
              <Input
                type="text"
                placeholder={get(optSpaceIds, '0')}
                onChange={(e, value) =>
                  setDelBtnEnable(value === stateStore.curSpaceId)
                }
              />
            </div>
          </div>
        ),
        style: styleObj.error,
      },
    }
    const { style, opName, desc } = operateObj[curSpaceOpt]
    return (
      <Modal
        visible
        title=""
        className={styles.modal}
        width={450}
        onCancel={() => handleModalClose(false)}
        footer={
          <>
            <Button type="defalut" onClick={() => handleModalClose(false)}>
              {getText('LEGO_UI_CANCEL')}
            </Button>
            <Button
              type={style.okType}
              disabled={!delBtnEnable}
              loading={loadStatus?.state === 'pending'}
              onClick={() => {
                workSpaceStore[curSpaceOpt]({
                  regionId,
                  spaceIds: optSpaceIds,
                }).then(() => {
                  stateStore.set({ curSpaceOpt: '', optSpaces: [] })
                })
              }}
            >
              {getText('LEGO_UI_OK')}
            </Button>
          </>
        }
      >
        <div className="tw-flex tw-items-start">
          <Icon
            name="if-exclamation"
            className="tw-mr-3 tw-text-2xl tw-leading-6"
            style={{ color: style.color }}
          />
          <div className="">
            <div className="tw-font-semibold tw-text-base tw-text-neut-15">
              {opName}工作空间: 工作空间{' '}
              {optSpacesNames.length > 1
                ? optSpacesNames.join(',')
                : get(optSpacesNames, '0')}
            </div>
            <div className="tw-text-neut-13 tw-mt-2">{desc}</div>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <FullModal
      title={`${curSpaceOpt === 'create' ? '创建' : '修改'}工作空间`}
      closable
      placement="rightFull"
      onOK={handleOk}
      onHide={() => handleModalClose(false)}
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
    </FullModal>
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
