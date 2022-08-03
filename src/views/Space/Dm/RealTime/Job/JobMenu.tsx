import { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { motion } from 'framer-motion'
import tw, { css, theme } from 'twin.macro'
import SimpleBar from 'simplebar-react'
import { Rnd } from 'react-rnd'
import { useStore } from 'stores'
import { HelpCenterLink } from 'components'
import { JobTree } from './JobTree'

interface JobMenuProps {
  className?: string
}

const JobMenu = observer((props: JobMenuProps) => {
  const jobTree = useRef<{ reset: () => void; search: (v: string) => void }>(null)
  const [isOpenHelp, setIsOpenHelp] = useState(true)
  const { workFlowStore } = useStore()

  const showCreateModal = () => {
    workFlowStore.toggleJobModal(true)
    if (jobTree) {
      jobTree.current?.reset()
    }
  }

  const handleSearch = (v: string) => {
    if (jobTree) {
      jobTree.current?.search(v)
    }
  }

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
      <div tw="flex justify-between items-center h-11 px-2 border-b dark:border-neut-15">
        <span tw="text-xs font-semibold">作业</span>
        <div tw="flex items-center">
          <Icon name="add" type="light" clickable onClick={() => showCreateModal()} />
        </div>
      </div>
      <div tw="border-b dark:border-neut-15">
        <div tw="mt-3 px-2 flex items-center ">
          <InputSearch
            tw="border-2 rounded-sm  dark:border-neut-15"
            placeholder="搜索作业名称"
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
              <HelpCenterLink href="/manual/mgt_job/summary/">作业是什么？</HelpCenterLink>
            </li>
            <li>
              <HelpCenterLink href="/manual/mgt_job/create_job/">作业的操作指南</HelpCenterLink>
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
            <span tw="align-middle">创建作业</span>
          </button>
        </div>
      </div>
      <div tw="pt-4 flex-1 h-full overflow-y-auto">
        <SimpleBar tw="h-full">
          <JobTree ref={jobTree} />
        </SimpleBar>
      </div>
    </Rnd>
  )
})
export default JobMenu
