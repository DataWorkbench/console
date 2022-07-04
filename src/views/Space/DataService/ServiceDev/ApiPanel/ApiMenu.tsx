import { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { Menu } from '@QCFE/lego-ui'
import { motion } from 'framer-motion'
import tw, { css, theme } from 'twin.macro'
import SimpleBar from 'simplebar-react'
import { Rnd } from 'react-rnd'
import { HelpCenterLink } from 'components'
import { followCursor } from 'tippy.js'
import Tippy from '@tippyjs/react'
import { useQueryListApiGroups, useStore } from 'hooks'
import { get } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { ApiTree } from './ApiTree'
import ApiGroupModal from '../Modal/ApiGroupModal'
import ApiModal from '../Modal/ApiModal'

interface JobMenuProps {
  className?: string
}

const { MenuItem } = Menu as any

const ApiMenu = observer((props: JobMenuProps) => {
  const apiTree = useRef<{ reset: () => void; search: (v: string) => void }>(null)
  const [isOpenHelp, setIsOpenHelp] = useState(true)
  const [visible, setVisible] = useState<boolean>()
  const [showApiGroupModal, setShowApiGroupModal] = useState<boolean>()
  const [showApiModal, setShowApiModal] = useState<boolean>()
  const showCreateModal = () => {
    setVisible(true)
  }
  const { spaceId } = useParams<{ spaceId: string }>()

  const {
    dtsDevStore: { setTreeData }
  } = useStore()

  const { data } = useQueryListApiGroups({ uri: { space_id: spaceId } })

  useEffect(() => {
    if (data) {
      const tree = get(data, 'infos', [])?.map((item) => ({
        ...item,
        key: item.id,
        pid: item.id,
        title: item.name,
        isLeaf: false
      }))
      setTreeData(tree as any)
    }
  }, [data, setTreeData])

  const hideCreateModal = () => {
    setVisible(false)
  }

  const handleSearch = (v: string) => {
    if (apiTree) {
      apiTree.current?.search(v)
    }
  }

  const onRightMenuClick = useCallback((e, key: string, val: string | number) => {
    if (val === 'createApiGroup') {
      setShowApiGroupModal(true)
    } else if (val === 'createApi') {
      setShowApiModal(true)
    }
    hideCreateModal()
  }, [])

  return (
    <Rnd
      tw="w-56 bg-neut-16 rounded dark:text-white"
      disableDragging
      className={props.className}
      minWidth={224}
      maxWidth={480}
      enableResizing={{
        right: true
      }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Tippy
        followCursor="initial"
        plugins={[followCursor]}
        visible={visible}
        onClickOutside={() => setVisible(false)}
        interactive
        arrow={false}
        placement="right-start"
        theme="darker"
        duration={[100, 0]}
        offset={[5, 5]}
        appendTo={() => document.body}
        content={
          <div tw="border border-neut-13 rounded-sm">
            <Menu onClick={onRightMenuClick}>
              <MenuItem value="createApiGroup">
                <Icon name="edit" size={14} type="light" />
                <span>创建API服务组</span>
              </MenuItem>
              <MenuItem value="createApi">
                <Icon name="edit" size={14} type="light" />
                <span>创建API</span>
              </MenuItem>
            </Menu>
          </div>
        }
      >
        <>
          <div tw="flex justify-between items-center h-11 px-2 border-b dark:border-neut-15">
            <span tw="text-xs font-semibold">数据服务</span>

            <div tw="flex items-center">
              <Icon name="add" type="light" clickable onClick={() => showCreateModal()} />
            </div>
          </div>
          <div tw="border-b dark:border-neut-15">
            <div tw="mt-3 px-2 flex items-center">
              <InputSearch
                tw="border-2 rounded-sm  dark:border-neut-15"
                placeholder="搜索API/AP分组名称"
                onPressEnter={(evt) => {
                  handleSearch((evt.target as HTMLInputElement).value)
                }}
                onClear={() => {
                  handleSearch('')
                }}
              />
            </div>
            <motion.div
              tw="mx-2 mt-3 bg-neut-17 p-2"
              animate={
                isOpenHelp
                  ? {
                      opacity: 1
                    }
                  : {
                      opacity: 0,
                      transitionEnd: {
                        display: 'none'
                      }
                    }
              }
              exit={{ display: 'none' }}
            >
              <div tw="flex items-center justify-between border-b border-neut-13 pb-1">
                <span>👋️ 快速上手文档</span>
                <Icon
                  name="close"
                  type="light"
                  onClick={() => setIsOpenHelp(false)}
                  css={[
                    tw`-mt-4 cursor-pointer`,
                    css`
                      &:hover {
                        svg {
                          ${tw`text-white!`}
                        }
                      }
                    `
                  ]}
                  color={{
                    primary: theme('colors.neut.8')
                  }}
                />
              </div>
              <ul tw="pt-2">
                <li>
                  <HelpCenterLink href="/manual/data_development/job/summary/">
                    数据服务是什么？
                  </HelpCenterLink>
                </li>
                <li>
                  <HelpCenterLink href="/manual/data_development/job/create_job_sql/">
                    数据服务的操作指南
                  </HelpCenterLink>
                </li>
              </ul>
            </motion.div>
            <div tw="text-center my-3">
              <button
                type="button"
                onClick={() => showCreateModal()}
                tw="py-1 rounded-sm w-48 bg-neut-13 focus:outline-none hover:bg-neut-10 ring-opacity-50"
              >
                <Icon name="add" type="light" tw="align-middle" />
                <span tw="align-middle">新建</span>
              </button>
            </div>
          </div>
          <div tw="pt-4 flex-1 h-full overflow-y-auto">
            <SimpleBar tw="h-full">
              <ApiTree ref={apiTree} />
            </SimpleBar>
          </div>
        </>
      </Tippy>
      {showApiGroupModal && <ApiGroupModal onClose={() => setShowApiGroupModal(false)} />}
      {showApiModal && <ApiModal onClose={() => setShowApiModal(false)} />}
    </Rnd>
  )
})
export default ApiMenu
