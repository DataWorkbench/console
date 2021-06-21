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
      <li className="flex items-center py-2 px-5 cursor-pointer hover:bg-neutral-N15 ">
        <Icon name="blockchain" />
        数据源管理
      </li>
      <li className="flex items-center py-2 px-5 cursor-pointer hover:bg-neutral-N15">
        <Icon name="blockchain" />
        网络连通工具
      </li>
      <li className="flex items-center py-2 px-5 cursor-pointer hover:bg-neutral-N15">
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
        'rounded border border-t-4 text-neutral-N8 border-neutral-N2',
        className
      )}
    >
      <div className="flex justify-between px-4 pt-5 mb-7 ">
        <div className="flex-1 flex">
          <div
            className={clsx(
              'w-11 h-11 flex justify-center items-center text-base font-medium rounded-sm',
              styles.profile
            )}
          >
            {getProfileName(title)}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <span className="font-medium text-base text-neutral-N16">
                {title}
              </span>
              <span>（{id}）</span>
              <span
                className={clsx(
                  'py-0.5 px-3 rounded-2xl inline-flex items-center',
                  status === 'active' ? styles.st_active : styles.st_forbidden
                )}
              >
                <Icon name="radio" />
                {status === 'active' ? '活跃' : '已禁用'}
              </span>
            </div>
            <div className="pt-1">{subtitle}</div>
          </div>
        </div>
        <div
          className="relative h-6"
          onMouseEnter={() => setMoreMenuVisible(!moreMenuVisible)}
          onMouseLeave={() => setMoreMenuVisible(false)}
        >
          <span>
            <Icon name="more" clickable size={24} />
          </span>
          <div
            className={clsx(
              `absolute top-6 right-0 w-28 bg-white shadow border-neutral-N2 text-neutral-N15 border rounded-sm py-2 transition-all transform ease-out`,
              moreMenuVisible
                ? 'opacity-1 scale-100'
                : 'opacity-0 scale-95 invisible'
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
      <div className="flex justify-between items-center px-4 mb-3">
        <div>
          <span>我的角色：</span>
          <span className="bg-neutral-N13 rounded-2xl text-white px-2 py-0.5 inline-block mr-1">
            {owner}
          </span>
          <span className="bg-neutral-N2 text-neutral-N15 rounded-2xl px-2 py-0.5 inline-block">
            运维
          </span>
        </div>
        <div className="flex items-center ">
          <div>空间成员</div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-neutral-N3 rounded-full flex items-center justify-center mx-1">
              <Icon name="human" size={18} />
            </div>
            <div className="w-6 h-6 bg-neutral-N3 rounded-full flex items-center justify-center mr-1">
              <Icon name="human" size={18} />
            </div>
            <div className="w-6 h-6 bg-neutral-N3 rounded-full flex items-center justify-center">
              <Icon name="human" size={18} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-4 mb-3">
        <div>
          <span>开通引擎：</span>
          <span>共享Flink、QingMR、Deep Learning...查看</span>
        </div>
        <div>
          <span>
            创建时间：
            <span className="text-neutral-N16">2021-03-17</span>
          </span>
        </div>
      </div>
      <div className="px-5 py-4 flex justify-center bg-neutral-N1 border-t border-neutral-N3">
        <Tooltip className="p-0" content={optMenu} placement="bottomRight">
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
