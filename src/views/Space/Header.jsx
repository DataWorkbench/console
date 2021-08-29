import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'
import { Icon, Select } from '@QCFE/qingcloud-portal-ui'
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { useMount } from 'react-use'
import { useStore } from 'stores'

const propTypes = {
  darkMode: PropTypes.bool,
}
const defaultProps = {
  darkMode: false,
}
function Header({ darkMode }) {
  const { regionId, spaceId } = useParams()
  const { pathname } = useLocation()
  const history = useHistory()
  const {
    globalStore: { user },
    spaceStore,
    spaceStore: { workspaces },
    workSpaceStore: { funcList },
  } = useStore()
  const matched = pathname.match(/workspace\/[^/]*\/([^/]*)/)
  const mod = matched ? matched[1] : 'upcloud'

  const loadData = () =>
    spaceStore.fetchSpaces({
      regionId,
    })

  useMount(async () => {
    // spaceStore.reset()
    // loadData()
    spaceStore.fetchSpaces({
      regionId,
      reload: true,
    })

    // await workSpaceStore.fetchData({
    //   regionId,
    // })
    // if (infos) {
    //   setWorkspaces(infos)
    //   const curSpace = infos.find((info) => info.id === spaceId)
    //   if (curSpace) {
    //     workSpaceStore.set({ curSpace })
    //   }
    // }
  })

  return (
    <div
      className={clsx(
        'tw-h-14 tw-flex tw-items-center tw-justify-between  tw-shadow-lg tw-bg-white dark:tw-bg-neut-16 dark:tw-text-neut-8'
      )}
    >
      <div className="tw-flex tw-items-center">
        <div className="tw-flex tw-justify-center tw-h-14 tw-items-center tw-w-14 tw-bg-neut-1 dark:tw-bg-neut-13 tw-cursor-pointer">
          <Icon
            name="if-ninedot"
            style={{ fontSize: 32 }}
            className="dark:tw-text-white"
          />
        </div>
        <div className="tw-text-sm tw-w-8 tw-h-8 tw-mx-3 tw-bg-neut-3 tw-rounded-sm tw-flex tw-justify-center tw-items-center">
          工
        </div>
        <Select
          defaultValue={spaceId}
          isLoadingAtBottom
          searchable
          onMenuScrollToBottom={loadData}
          bottomTextVisible
          options={workspaces.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          onChange={(v) => history.push(`/${regionId}/workspace/${v}/${mod}`)}
        />
      </div>
      <div>
        {funcList.map(({ title, name }) => (
          <Link
            key={name}
            className={clsx(
              mod === name &&
                'tw-font-semibold tw-relative after:tw-absolute after:tw-content-[" "] after:tw-w-3/5 after:tw-h-0.5 after:tw-left-[20%] after:tw-bottom-0.5 after:tw-bg-green-11 dark:tw-text-white',
              'tw-inline-block tw-py-3 tw-mr-6 tw-text-sm dark:hover:tw-text-white'
            )}
            to={`/${regionId}/workspace/${spaceId}/${name}`}
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
          className={clsx('tw-mr-2 tw-cursor-pointer')}
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
        <span className="tw-mr-2 dark:tw-text-white">{user?.user_name}</span>
        <span className="tw-mr-6 tw-inline-block tw-bg-neut-2 dark:tw-bg-neut-13 dark:tw-text-white tw-px-2 tw-py-0.5 tw-rounded-2xl">
          项目所有者
        </span>
      </div>
    </div>
  )
}

Header.propTypes = propTypes
Header.defaultProps = defaultProps

export default observer(Header)
