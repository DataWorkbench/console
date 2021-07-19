import React from 'react'
import { useToggle } from 'react-use'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Tooltip } from '@QCFE/lego-ui'
import { Icon, Modal, Message } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import Card from 'components/Card'
import styles from './styles.module.css'

function getProfileName(str) {
  const pattern = new RegExp('[\u4E00-\u9FA5]+')
  const profileName = str.substr(0, 2)
  if (pattern.test(profileName)) {
    return str.substr(0, 1)
  }
  return profileName
}

const propTypes = {
  zone: PropTypes.string,
  space: PropTypes.object,
  className: PropTypes.string,
}
function SpaceItem({ zone, space, className }) {
  const { id, name, desc, status, owner, created } = space
  const [moreMenuVisible, setMoreMenuVisible] = useToggle(false)
  const {
    workspaceStore,
    workspaceStore: { funcList },
  } = useStore()
  const handleDelete = () => {
    const curModal = Modal.open(Modal, {
      onAsyncOk: () => {
        return workspaceStore.delete(id).then(
          () => {
            Message.open({
              content: '操作成功',
              type: 'success',
              placement: 'bottomRight',
            })
            Modal.close(curModal)
          },
          (err) =>
            Message.open({
              content: `操作失败: ${err}`,
              type: 'error',
              placement: 'bottomRight',
            })
        )
      },
      title: '确定要删除吗',
      content: `确定要删除${id}`,
    })
  }

  const handleUpdate = () => {
    workspaceStore.set({ showModal: true, curSpace: space, curOpt: 'update' })
  }

  return (
    <Card
      className={clsx(
        'tw-rounded tw-border tw-border-t-4 tw-text-neutral-N8 tw-border-neutral-N2',
        className
      )}
    >
      <div className="tw-flex tw-justify-between tw-px-4 tw-pt-5 tw-mb-7 ">
        <div className="tw-flex-1 tw-flex">
          <div
            className={clsx(
              'tw-w-11 tw-h-11 tw-flex tw-justify-center tw-items-center tw-text-base tw-font-medium tw-rounded-sm',
              styles.profile
            )}
          >
            {getProfileName(name)}
          </div>
          <div className="tw-ml-3">
            <div className="tw-flex tw-items-center">
              <span className="tw-font-medium tw-text-base tw-text-neutral-N16">
                {name}
              </span>
              <span>（{id}）</span>
              <span
                className={clsx(
                  'tw-py-0.5 tw-px-3 tw-rounded-2xl tw-inline-flex tw-items-center',
                  status === 1 ? styles.st_active : styles.st_forbidden
                )}
              >
                <Icon name="radio" />
                {status === 1 ? '活跃' : '已禁用'}
              </span>
            </div>
            <div className="tw-pt-1">{desc}</div>
          </div>
        </div>
        <div
          className="tw-relative tw-h-6"
          onMouseEnter={() => setMoreMenuVisible(true)}
          onMouseLeave={() => setMoreMenuVisible(false)}
        >
          <span>
            <Icon name="more" clickable size={24} />
          </span>
          <div
            className={clsx(
              `tw-absolute tw-top-6 tw-right-0 tw-w-28 tw-bg-white tw-shadow tw-border-neutral-N2 tw-text-neutral-N15 tw-border rounded-sm tw-py-2 tw-transition-all tw-transform tw-ease-out`,
              moreMenuVisible
                ? 'tw-opacity-1 tw-scale-100'
                : 'tw-opacity-0 tw-scale-95 tw-invisible'
            )}
          >
            <>
              <div className={styles.moreMenuItem} onClick={handleUpdate}>
                修改工作空间
              </div>
              <div className={styles.moreMenuItem}>禁用工作空间</div>
              <div className={styles.moreMenuItem}>启动工作空间</div>
              <div className={styles.moreMenuItem} onClick={handleDelete}>
                删除
              </div>
            </>
          </div>
        </div>
      </div>
      <div className="tw-flex tw-justify-between tw-items-center tw-px-4 tw-mb-3">
        <div>
          <span>我的角色：</span>
          <span className="tw-bg-neutral-N13 tw-rounded-2xl tw-text-white tw-px-2 tw-py-0.5 tw-inline-block tw-mr-1">
            {owner}
          </span>
          <span className="tw-bg-neutral-N2 tw-text-neutral-N15 tw-rounded-2xl tw-px-2 tw-py-0.5 tw-inline-block">
            运维
          </span>
        </div>
        <div className="tw-flex tw-items-center ">
          <div>空间成员</div>
          <div className="tw-flex tw-items-center">
            <div className="tw-w-6 tw-h-6 tw-bg-neutral-N3 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-1">
              <Icon name="human" size={18} />
            </div>
            <div className="tw-w-6 tw-h-6 tw-bg-neutral-N3 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1">
              <Icon name="human" size={18} />
            </div>
            <div className="tw-w-6 tw-h-6 tw-bg-neutral-N3 tw-rounded-full tw-flex tw-items-center tw-justify-center">
              <Icon name="human" size={18} />
            </div>
          </div>
        </div>
      </div>
      <div className="tw-flex tw-justify-between tw-px-4 tw-mb-3">
        <div className="tw-flex">
          <div className="tw-w-60 2xl:tw-w-auto tw-overflow-hidden tw-break-all tw-whitespace-nowrap tw-overflow-ellipsis">
            开通引擎：共享Flink、QingMR、Deep Learning
          </div>
          <a href="##" className="tw-text-link">
            查看
          </a>
        </div>
        <div>
          <span>
            创建时间：
            <span className="tw-text-neutral-N16">
              {dayjs.unix(created).format('YYYY-MM-DD hh:mm:ss')}
            </span>
          </span>
        </div>
      </div>
      <div className="tw-px-5 tw-py-4 tw-flex tw-justify-center tw-bg-neutral-N1 tw-border-t tw-border-neutral-N3">
        {funcList.map(({ name: funcName, title, subFuncList }, i) => (
          <Tooltip
            className="tw-p-0"
            key={funcName}
            content={subFuncList.map((subFunc) => (
              <Link
                key={subFunc.name}
                to={`${zone}/workspace/${id}/${funcName}/${subFunc.name}`}
                className="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neutral-N15 hover:tw-text-white"
              >
                <Icon name="blockchain" />
                {subFunc.title}
              </Link>
            ))}
            placement="bottomRight"
          >
            <Link
              to={`${zone}/workspace/${id}/${funcName}`}
              className="hover:tw-text-brand-G11"
            >
              <button
                type="button"
                className={clsx(
                  'tw-font-semibold tw-text-xs tw-rounded-sm tw-text-neutral-N13  tw-bg-neutral-N1 tw-border tw-border-neutral-N3',
                  'tw-px-4 2xl:tw-px-8 tw-py-1',
                  i < funcList.length - 1 ? 'tw-mr-4' : 'tw-mr-0',
                  'focus:tw-outline-none hover:tw-bg-brand-G0 hover:tw-border-brand-G11 hover:tw-shadow tw-transition-colors'
                )}
              >
                {title}
              </button>
            </Link>
          </Tooltip>
        ))}
      </div>
    </Card>
  )
}
SpaceItem.propTypes = propTypes

export default SpaceItem
