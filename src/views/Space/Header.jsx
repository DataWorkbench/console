import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Select } from '@QCFE/qingcloud-portal-ui'
import { Link, useParams, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import styles from './styles.module.css'

const propTypes = {
  darkMode: PropTypes.bool,
}
const defaultProps = {
  darkMode: false,
}
const navItems = [
  {
    title: '数据上云',
    name: 'upcloud',
  },
  {
    title: '云上加工',
    name: 'dm',
  },
  {
    title: '运维中心',
    name: 'ops',
  },
  {
    title: '空间管理',
    name: 'manage',
  },
]
function Header({ darkMode }) {
  const { space } = useParams()
  const { pathname } = useLocation()
  const matched = pathname.match(/workspace\/[^/]*\/([^/]*)/)
  const mod = matched ? matched[1] : 'upcloud'

  return (
    <div
      className={clsx(
        'tw-h-14 tw-flex tw-items-center tw-justify-between  tw-shadow-lg tw-bg-white dark:tw-bg-neutral-N16 dark:tw-text-neutral-N8'
      )}
    >
      <div className="tw-flex tw-items-center">
        <div className="tw-flex tw-justify-center tw-h-14 tw-items-center tw-w-14 tw-bg-neutral-N1 dark:tw-bg-neutral-N13 tw-cursor-pointer">
          <Icon
            name="if-ninedot"
            style={{ fontSize: 32 }}
            className="dark:tw-text-white"
          />
        </div>
        <div className="tw-text-sm tw-w-8 tw-h-8 tw-mx-3 tw-bg-neutral-N3 tw-rounded-sm tw-flex tw-justify-center tw-items-center">
          工
        </div>
        <Select
          name="os"
          value="CentOS"
          options={[
            { value: 'CentOS', label: 'CentOS 5.8 32bit' },
            { value: 'Debian', label: 'Debian Jessie 8.1 64bit' },
            {
              value: 'Ubuntu',
              label: 'Ubuntu Server 14.04.3 LTS 64bit',
              disabled: true,
            },
            { value: 'Windows', label: 'Windows Server 2003 R2' },
          ]}
        />
      </div>
      <div>
        {navItems.map(({ title, name }) => (
          <Link
            key={name}
            className={clsx(
              mod === name &&
                'tw-font-semibold tw-relative after:tw-absolute after:tw-content-[" "] after:tw-w-3/5 after:tw-h-0.5 after:tw-left-[20%] after:tw-bottom-0.5 after:tw-bg-brand-G11 dark:tw-text-white',
              'tw-inline-block tw-py-3 tw-mr-6 tw-text-sm dark:hover:tw-text-white'
            )}
            to={`/workspace/${space}/${name}`}
          >
            {title}
          </Link>
        ))}
      </div>
      <div className="tw-flex tw-items-center">
        <Icon
          name="bell"
          size="medium"
          type={darkMode ? 'light' : 'dark'}
          changeable
          className={clsx('tw-mr-2 tw-cursor-pointer', styles.menuBell)}
        />
        <Icon
          name="cogwheel"
          type={darkMode ? 'light' : 'dark'}
          size="medium"
          changeable
          className="tw-mr-2 tw-cursor-pointer"
        />
        <Icon
          name="documentation"
          type={darkMode ? 'light' : 'dark'}
          size="medium"
          changeable
          className="tw-mr-2 tw-cursor-pointer"
        />
        <span className="tw-mr-2 dark:tw-text-white">user.name</span>
        <span className="tw-mr-6 tw-inline-block tw-bg-neutral-N2 dark:tw-bg-neutral-N13 dark:tw-text-white tw-px-2 tw-py-0.5 tw-rounded-2xl">
          项目所有者
        </span>
      </div>
    </div>
  )
}

Header.propTypes = propTypes
Header.defaultProps = defaultProps

export default Header
