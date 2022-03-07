import { useRef, useState, useCallback } from 'react'
import { Icon, Menu, Form, Modal } from '@QCFE/lego-ui'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import { Icons, Center, AffixLabel, Confirm, Tree } from 'components'
import tw, { css, styled } from 'twin.macro'
import { useParams } from 'react-router-dom'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'
import { useMutationStreamJob } from 'hooks'
import { loadWorkFlow } from 'stores/api'
import { useQueryClient } from 'react-query'
import { followCursor } from 'tippy.js'
import Tippy from '@tippyjs/react'
import { nameMatchRegex, strlen } from 'utils'
import { TreeIconTheme, RtType, JobMode } from './JobConstant'
import { JobModal } from './JobModal'

const { MenuItem } = Menu
const { TextField } = Form

const TreeWrapper = styled('div')(() => [
  tw`relative`,
  css`
    .rc-tree {
      .rc-tree-treenode {
        span.rc-tree-node-content-wrapper {
          &.rc-tree-node-content-wrapper-open,
          &.rc-tree-node-content-wrapper-close {
            ${tw`font-semibold`}
          }
          &.rc-tree-node-content-wrapper-normal {
            ${tw`text-white text-opacity-80`}
          }
        }
      }
    }
  `,
])

const findTreeNode: any = (treeData: any[], nodeKey: string) => {
  let find = null
  treeData.forEach((node) => {
    if (node.key === nodeKey) {
      find = node
    } else if (node.children?.length) {
      const findInChildren = findTreeNode(node.children, nodeKey)
      if (findInChildren) {
        find = findInChildren
      }
    }
  })
  return find
}

const IconWrapper = styled(Center)(({ theme }: { theme: TreeIconTheme }) => [
  tw`w-4 h-4 rounded-sm`,
  theme === TreeIconTheme.BLUE && tw`bg-blue-10`,
  theme === TreeIconTheme.GREEN && tw`bg-green-11`,
  theme === TreeIconTheme.GREY && tw`bg-white bg-opacity-20 `,
  theme === TreeIconTheme.YELLOW && tw`bg-white bg-opacity-20 text-[#FFD127]`,
])

export const JobTree = () => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const [filter, setFilter] = useImmer({
    search: '',
    offset: 0,
    limit: 100,
    pid: '',
    reverse: false,
    sort_by: 'created',
  })
  const [treeData, setTreeData] = useState([
    {
      key: 'di-root',
      pid: '',
      title: '数据集成',
      isLeaf: false,
      children: [],
    },
    {
      key: 'rt-root',
      pid: '',
      title: '实时-流式开发',
      isLeaf: false,
      children: [],
    },
  ])
  const [curOpNode, setCurOpNode] = useState(treeData[1])
  const [loadedKeys, setLoadedKeys] = useState<string[]>([])
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])

  const form = useRef<Form>(null)
  const treeEl = useRef(null)
  const [visible, setVisible] = useState<any>(null)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showJobModal, setShowJobModal] = useState(false)
  const [jobParams, setJobParams] = useImmer<{
    op: 'create' | 'edit'
    jobType: RtType
    jobMode: JobMode
    pid: string
    job: any
  }>({
    op: 'create',
    jobType: RtType.SQL,
    jobMode: JobMode.RT,
    pid: 'rt-root',
    job: null,
  })

  const queryClient = useQueryClient()
  const mutation = useMutationStreamJob()

  const isRootNode = useCallback(
    (node) => ['di-root', 'rt-root'].includes(node.key),
    []
  )

  const onRightClick = useCallback(({ node }) => {
    setCurOpNode(node)

    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    }, 200)
  }, [])

  const onRmbMenuClick = useCallback(
    (e, key: string, value) => {
      setVisible(false)
      if (value === 'folder') {
        setShowFolderModal(true)
      } else if (value === 'delete') {
        setShowConfirm(true)
      } else if ([RtType.SQL, RtType.JAR, RtType.PYTHON].includes(value)) {
        setShowJobModal(true)
        setJobParams((draft) => {
          draft.jobType = value
          draft.jobMode = JobMode.RT
          draft.op = 'create'
          draft.pid = curOpNode.key
        })
      }
    },
    [setJobParams, curOpNode.key]
  )

  const renderRmbMenu = useCallback(
    (node) => {
      if (node) {
        if (!node.isLeaf) {
          const isRoot = isRootNode(node)
          return (
            <Menu onClick={onRmbMenuClick}>
              <MenuItem value="folder">
                <Icons name="folderAdd" size={14} tw="mr-2" />
                <span>创建{isRoot ? '' : '子'}文件夹</span>
              </MenuItem>
              {!isRoot && (
                <>
                  <MenuItem value="move">
                    <Icons name="folderHistory" size={14} tw="mr-2" />
                    <span>移动文件夹</span>
                  </MenuItem>
                  <MenuItem value="edit">
                    <Icon name="edit" size={14} type="light" tw="mr-2" />
                    <span>编辑文件夹</span>
                  </MenuItem>
                </>
              )}
              <MenuItem value={RtType.SQL}>
                <Icons name="sql" size={14} tw="mr-2" />
                <span>SQL 模式</span>
              </MenuItem>
              <MenuItem value={RtType.PYTHON}>
                <Icons name="python" size={14} tw="mr-2" />
                <span>Python 模式</span>
              </MenuItem>
              <MenuItem value={RtType.JAR}>
                <Icons name="jar" size={14} tw="mr-2" />
                <span>Jar 包模式</span>
              </MenuItem>
              <MenuItem disabled>
                <Icons name="operator" size={14} tw="mr-2" />
                <span>算子编排模式</span>
              </MenuItem>
              {!isRoot && (
                <MenuItem value="delete">
                  <Icon name="delete" size={14} type="light" />
                  <span>删除</span>
                </MenuItem>
              )}
            </Menu>
          )
        }
      }
      return null
    },
    [onRmbMenuClick, isRootNode]
  )

  const renderIcon = useCallback((props) => {
    const { data, loading } = props
    if (loading) {
      return <Loading size={16} />
    }
    let iconName = 'folder'
    let theme: TreeIconTheme = TreeIconTheme.GREY
    if (data) {
      const { key } = data

      if (key === 'rt-root') {
        iconName = 'flash'
        theme = TreeIconTheme.BLUE
      } else if (key === 'di-root') {
        iconName = 'equalizer'
        theme = TreeIconTheme.GREEN
      } else if (data.isLeaf) {
        if (data.rootKey === 'rt-root') {
          const type = get(data, 'job.type')
          if (type === RtType.SQL) {
            iconName = 'sql'
          } else if (type === RtType.JAR) {
            iconName = 'jar'
          } else if (type === RtType.PYTHON) {
            iconName = 'python'
          }
        }
      } else if (!data.isLeaf || data.children?.length) {
        iconName = 'folder'
        theme = TreeIconTheme.YELLOW
      }
    }
    return (
      <IconWrapper theme={theme}>
        <Icons name={iconName} size={12} />
      </IconWrapper>
    )
  }, [])

  const fetchJobTreeData = (node: any) => {
    const isRoot = isRootNode(node)
    const params = {
      regionId,
      spaceId,
      ...filter,
      pid: isRoot ? '' : node.key,
    }

    return queryClient
      .fetchQuery(['job', params], async () => loadWorkFlow(params))
      .then((data) => {
        const jobs = get(data, 'infos') || []
        const newTreeData = [...treeData]
        const pNode = findTreeNode(newTreeData, node.key)
        if (pNode) {
          const children = jobs.map((job) => {
            const childNode = pNode.children?.find((c: any) => c.key === job.id)
            if (childNode) {
              return childNode
            }
            return {
              key: job.id,
              rootKey: isRoot ? node.key : node.rootKey,
              pid: node.key,
              title: job.name,
              isLeaf: !job.is_directory,
              job,
            }
          })
          pNode.children = children
          setLoadedKeys([...loadedKeys, node.key])
          setExpandedKeys([...expandedKeys, node.key])
          setTreeData(newTreeData)
        }
        return data
      })
  }

  const handleTreeExpand = (keys: string[]) => {
    setExpandedKeys(keys)
  }

  const handleTreeload = (keys: any[]) => {
    setLoadedKeys(keys)
  }

  const handleMutate = (op: 'create' | 'delete') => {
    let data = { op }
    const { key, pid } = curOpNode
    if (op === 'create') {
      if (form.current?.validateForm()) {
        const fields = form.current.getFieldsValue()
        data = {
          ...data,
          ...fields,
          pid: key,
          is_directory: true,
        }
      }
    } else if (op === 'delete') {
      data = {
        ...data,
        job_ids: [key],
      }
    }

    mutation.mutate(data, {
      onSuccess: () => {
        setShowFolderModal(false)
        setShowConfirm(false)
        const pNode = op === 'create' ? curOpNode : findTreeNode(treeData, pid)
        fetchJobTreeData(pNode)
      },
    })
  }

  const handleLoadData = (node) => {
    setFilter((draft) => {
      draft.pid = node.pid
    })
    return fetchJobTreeData(node)
  }

  const handleJobModalClose = (created: boolean) => {
    setShowJobModal(false)
    if (created === true) {
      fetchJobTreeData(curOpNode)
    }
  }

  return (
    <>
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
            {renderRmbMenu(curOpNode)}
          </div>
        }
      >
        <TreeWrapper ref={treeEl}>
          <Tree
            treeData={treeData}
            loadedKeys={loadedKeys}
            expandedKeys={expandedKeys}
            tw="ml-2"
            icon={renderIcon}
            switcherIcon={(props) => {
              const { expanded, isLeaf } = props
              if (isLeaf) {
                return null
              }
              return (
                <Icon
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  type="light"
                />
              )
            }}
            onRightClick={onRightClick}
            draggable={(props) => {
              const { key } = props
              if (key === 'rt-root' || key === 'di-root') {
                return false
              }
              return true
            }}
            dropIndicatorRender={({ dropLevelOffset }) => {
              return (
                <div
                  tw="absolute bg-red-10 h-0.5 right-0 pointer-events-none"
                  style={{ left: dropLevelOffset }}
                />
              )
            }}
            loadData={handleLoadData}
            onExpand={handleTreeExpand}
            onLoad={handleTreeload}
          />
        </TreeWrapper>
      </Tippy>
      {showFolderModal && (
        <Modal
          title="创建文件夹"
          visible
          appendToBody
          width={600}
          onCancel={() => setShowFolderModal(false)}
          okText="创建"
          onOk={() => handleMutate('create')}
          confirmLoading={mutation.isLoading}
          showConfirmLoading={mutation.isLoading}
        >
          <Form layout="horizon" ref={form}>
            <TextField
              name="name"
              label={<AffixLabel>文件夹名称</AffixLabel>}
              validateOnBlur
              schemas={[
                {
                  rule: {
                    required: true,
                    matchRegex: nameMatchRegex,
                  },
                  help: '允许包含字母、数字或下划线（_）,不能以（_）开始结尾',
                  status: 'error',
                },
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l >= 2 && l <= 128
                  },
                  help: '允许包含字母、数字 及 "_"，长度2～128',
                  status: 'error',
                },
              ]}
            />
          </Form>
        </Modal>
      )}

      {showConfirm && (
        <Confirm
          visible
          width={400}
          type="warn"
          okText="确认"
          onCancel={() => setShowConfirm(false)}
          onOk={() => handleMutate('delete')}
          title={`确认删除文件夹: ${curOpNode?.title}`}
          appendToBody
          confirmLoading={mutation.isLoading}
          showConfirmLoading={mutation.isLoading}
        >
          <div>
            确认删除文件夹：{curOpNode?.title}，该操作无法撤回。确认删除吗？
          </div>
        </Confirm>
      )}
      {showJobModal && (
        <JobModal
          treeData={treeData}
          op={jobParams.op}
          pid={jobParams.pid}
          jobMode={jobParams.jobMode}
          jobType={jobParams.jobType}
          onClose={handleJobModalClose}
        />
      )}
    </>
  )
}
export default JobTree
