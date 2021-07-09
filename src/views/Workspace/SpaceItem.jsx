import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Card from 'components/Card'
import { Tooltip } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import styles from './styles.module.css'

const optMenu = (
  <div>
    <ul>
      <li className="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neutral-N15 ">
        <Icon name="blockchain" />
        数据源管理
      </li>
      <li className="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neutral-N15">
        <Icon name="blockchain" />
        网络连通工具
      </li>
      <li className="tw-flex tw-items-center tw-py-2 tw-px-5 tw-cursor-pointer hover:tw-bg-neutral-N15">
        <Icon name="blockchain" />
        整库迁移
      </li>
    </ul>
  </div>
)

function getProfileName(str) {
  const pattern = new RegExp('[\u4E00-\u9FA5]+')
  const profileName = str.substr(0, 2)
  if (pattern.test(profileName)) {
    return str.substr(0, 1)
  }
  return profileName
}

function SpaceItem({ data, className }) {
  const { id, title, subtitle, status, owner } = data
  const [moreMenuVisible, setMoreMenuVisible] = useState(false)
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
            {getProfileName(title)}
          </div>
          <div className="tw-ml-3">
            <div className="tw-flex tw-items-center">
              <span className="tw-font-medium tw-text-base tw-text-neutral-N16">
                {title}
              </span>
              <span>（{id}）</span>
              <span
                className={clsx(
                  'tw-py-0.5 tw-px-3 tw-rounded-2xl tw-inline-flex tw-items-center',
                  status === 'active' ? styles.st_active : styles.st_forbidden
                )}
              >
                <Icon name="radio" />
                {status === 'active' ? '活跃' : '已禁用'}
              </span>
            </div>
            <div className="tw-pt-1">{subtitle}</div>
          </div>
        </div>
        <div
          className="tw-relative tw-h-6"
          onMouseEnter={() => setMoreMenuVisible(!moreMenuVisible)}
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
            <ul>
              <li className={styles.moreMenuItem}>修改工作空间</li>
              <li className={styles.moreMenuItem}>禁用工作空间</li>
              <li className={styles.moreMenuItem}>启动工作空间</li>
              <li className={styles.moreMenuItem}>删除</li>
            </ul>
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
        <div>
          <span>开通引擎：</span>
          <span>共享Flink、QingMR、Deep Learning...查看</span>
        </div>
        <div>
          <span>
            创建时间：
            <span className="tw-text-neutral-N16">2021-03-17</span>
          </span>
        </div>
      </div>
      <div className="tw-px-5 tw-py-4 tw-flex tw-justify-center tw-bg-neutral-N1 tw-border-t tw-border-neutral-N3">
        <Tooltip className="tw-p-0" content={optMenu} placement="bottomRight">
          <button type="button" className={styles.btn}>
            数据上云
          </button>
        </Tooltip>
        <button type="button" className={styles.btn}>
          数据上云
        </button>
        <button type="button" className={styles.btn}>
          数据上云
        </button>
      </div>
    </Card>
  )
}

SpaceItem.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
}

export default SpaceItem
