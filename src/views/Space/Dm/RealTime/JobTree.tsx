import { useRef, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Icon,
  Menu,
  Form,
  Modal,
  Control,
  Field,
  Label,
  Input,
  Button,
} from '@QCFE/lego-ui'
import { Icons, AffixLabel, Confirm, Tree, SelectTreeField } from 'components'
import tw, { css, styled, theme } from 'twin.macro'
import { useImmer } from 'use-immer'
import { useMutationStreamJob, useFetchJob } from 'hooks'
import { followCursor } from 'tippy.js'
import Tippy from '@tippyjs/react'
import { useUnmount } from 'react-use'
import { get, cloneDeep } from 'lodash-es'
import { useStore } from 'stores'
import { nameMatchRegex, strlen } from 'utils'
import { TreeNodeProps } from 'rc-tree'
import {
  JobType,
  RootKey,
  findTreeNode,
  getNewTreeData,
  removeTreeNode,
  filterFolderOfTreeData,
  isRootNode,
  getJobIdByKey,
  renderIcon,
  renderSwitcherIcon,
  JobMode,
} from './JobUtils'
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

export const JobTree = observer(() => {
  const fetchJob = useFetchJob()
  const {
    workFlowStore,
    workFlowStore: { treeData, loadedKeys },
  } = useStore()

  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [curOpNode, setCurOpNode] = useState(treeData[1])
  const [targetNodeKey, setTargetNodeKey] = useState<string>('')
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [curOp, setCurOp] = useState<'create' | 'edit' | 'move'>('create')
  const form = useRef<Form>(null)
  const treeEl = useRef(null)
  const [visible, setVisible] = useState<any>(null)
  const [showOpModal, setShowOpModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showJobModal, setShowJobModal] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [delBtnEnable, setDelBtnEnable] = useState(false)
  const [jobInfo, setJobInfo] = useImmer<{
    op: 'create' | 'edit'
    type?: JobType
    node?: TreeNodeProps
  }>({
    op: 'create',
    type: JobType.SQL,
    node: undefined,
  })
  const curOpWord = curOpNode.isLeaf ? '作业' : '文件夹'

  const mutation = useMutationStreamJob()

  useUnmount((): void => {
    workFlowStore.resetTreeData()
  })

  useEffect(() => {
    if (workFlowStore.curJob) {
      setSelectedKeys([workFlowStore.curJob.id])
    }
  }, [workFlowStore.curJob])

  const onRightClick = useCallback(({ node }) => {
    setCurOpNode(node)
    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    }, 200)
  }, [])

  const onRightMenuClick = useCallback(
    (e, key: string, val: string | number) => {
      setVisible(false)
      if (val === 'create' || val === 'edit' || val === 'move') {
        setShowOpModal(true)
        setCurOp(val)
      } else if (val === 'delete') {
        setShowConfirm(true)
      } else if (
        [
          JobType.OFFLINE,
          JobType.REALTIME,
          JobType.SQL,
          JobType.JAR,
          JobType.PYTHON,
          JobType.SCALA,
          JobType.OPERATOR,
        ].includes(val as JobType) ||
        val === 'editJob'
      ) {
        setJobInfo((draft) => {
          const isEdit = val === 'editJob'
          draft.op = isEdit ? 'edit' : 'create'
          draft.type = isEdit ? get(curOpNode, 'job.type') : val
          draft.node = curOpNode
        })

        setShowJobModal(true)
      } else if (val === 'scheSetting') {
        workFlowStore.set({
          curJob: get(curOpNode, 'job'),
          showScheSetting: true,
        })
      } else if (val === 'argsSetting') {
        workFlowStore.set({
          curJob: get(curOpNode, 'job'),
          showArgsSetting: true,
        })
      }
    },
    [curOpNode, setJobInfo, workFlowStore]
  )
  const renderRightMenu = useCallback(
    (node) => {
      if (!node) {
        return null
      }
      const isRoot = isRootNode(node.key)
      const isRt = node.jobMode === JobMode.RT
      const isDi = node.jobMode === JobMode.DI
      if (node.isLeaf) {
        return (
          <Menu onClick={onRightMenuClick}>
            <MenuItem value="editJob">
              <Icon name="edit" size={14} type="light" tw="mr-2" />
              <span>编辑信息</span>
            </MenuItem>
            <MenuItem value="move">
              <Icons name="NoteGearFill" size={14} tw="mr-2" />
              <span>移动作业</span>
            </MenuItem>
            {isRt && (
              <MenuItem value="association" disabled>
                <Icon
                  name="listview"
                  size={14}
                  tw="mr-2"
                  color={{
                    primary: theme('colors.white'),
                    secondary: theme('colors.white'),
                  }}
                />
                <span>关联实例</span>
              </MenuItem>
            )}
            <MenuItem
              value="scheSetting"
              disabled={isDi}
              onClick={onRightMenuClick}
            >
              <Icons name="Topology2Fill" size={14} tw="mr-2" />
              <span>调度设置</span>
            </MenuItem>
            {isRt && (
              <MenuItem value="scheSetting">
                <Icons name="Topology3Fill" size={14} tw="mr-2" />
                <span>运行参数配置</span>
              </MenuItem>
            )}

            <MenuItem value="history" disabled>
              <Icons name="Book3Fill" size={14} tw="mr-2" />
              <span>历史版本</span>
            </MenuItem>
            <MenuItem value="delete">
              <Icon name="delete" size={14} type="light" />
              <span>删除</span>
            </MenuItem>
          </Menu>
        )
      }
      return (
        <Menu onClick={onRightMenuClick}>
          <MenuItem value="create">
            <Icons name="FolderAddFill" size={14} tw="mr-2" />
            <span>创建{isRoot ? '' : '子'}文件夹</span>
          </MenuItem>
          {!isRoot && (
            <>
              <MenuItem value="move" onClick={onRightMenuClick}>
                <Icons name="FolderHistoryFill" size={14} tw="mr-2" />
                <span>移动文件夹</span>
              </MenuItem>
              <MenuItem value="edit" onClick={onRightMenuClick}>
                <Icon name="edit" size={14} type="light" tw="mr-2" />
                <span>编辑文件夹</span>
              </MenuItem>
            </>
          )}
          {isDi && (
            <>
              <MenuItem value={JobType.REALTIME} onClick={onRightMenuClick}>
                <Icons name="LayerFill" size={14} tw="mr-2" />
                <span>创建实时同步作业</span>
              </MenuItem>
              <MenuItem value={JobType.OFFLINE} onClick={onRightMenuClick}>
                <Icons name="DownloadBoxFill" size={14} tw="mr-2" />
                <span>创建离线同步作业</span>
              </MenuItem>
            </>
          )}
          {isRt && (
            <>
              <MenuItem value={JobType.SQL} onClick={onRightMenuClick}>
                <Icons name="sql" size={14} tw="mr-2" />
                <span>SQL 模式</span>
              </MenuItem>
              <MenuItem value={JobType.PYTHON} onClick={onRightMenuClick}>
                <Icons name="PythonFill" size={14} tw="mr-2" />
                <span>Python 模式</span>
              </MenuItem>
              <MenuItem value={JobType.JAR} onClick={onRightMenuClick}>
                <Icons name="JavaFill" size={14} tw="mr-2" />
                <span>Jar 包模式</span>
              </MenuItem>
              <MenuItem disabled onClick={onRightMenuClick}>
                <Icons name="Branch2Fill" size={14} tw="mr-2" />
                <span>算子编排模式</span>
              </MenuItem>
            </>
          )}

          {!isRoot && (
            <MenuItem value="delete">
              <Icon name="delete" size={14} type="light" />
              <span>删除</span>
            </MenuItem>
          )}
        </Menu>
      )
    },
    [onRightMenuClick]
  )
  const fetchJobTreeData = (node: any, movingNode = null) => {
    const pid = getJobIdByKey(node.key)
    const rootKey = node.key === node.pid ? node.key : node.rootKey
    return fetchJob(rootKey === RootKey.DI ? 'sync' : 'stream', {
      pid,
    })
      .then((data) => {
        const jobs = get(data, 'infos') || []
        const newTreeData = getNewTreeData(
          workFlowStore.treeData,
          node,
          jobs,
          movingNode
        )
        workFlowStore.set({
          treeData: newTreeData,
        })
        setExpandedKeys([...expandedKeys, node.key])
      })
      .catch((e) => {
        setExpandedKeys(expandedKeys.filter((key) => key !== node.key))
        throw e
      })
  }
  const handleMutate = (op: 'create' | 'edit' | 'move' | 'delete') => {
    const { key } = curOpNode
    let data: any = { op, jobMode: curOpNode.jobMode }
    if (op === 'create' || op === 'edit' || op === 'move') {
      if (form.current?.validateForm()) {
        const fields = form.current.getFieldsValue()
        const pid = op === 'move' ? targetNodeKey : curOpNode.key
        data = {
          ...data,
          ...fields,
        }
        if (op === 'create') {
          data.pid = getJobIdByKey(pid)
          data.is_directory = true
        } else if (op === 'edit') {
          data.jobId = key
        } else if (op === 'move') {
          data.job_ids = [key]
          data.target = getJobIdByKey(targetNodeKey)
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
        setShowOpModal(false)
        setShowConfirm(false)
        const pNode =
          op === 'create'
            ? curOpNode
            : findTreeNode(workFlowStore.treeData, curOpNode.pid)
        if (op === 'create' || op === 'edit') {
          fetchJobTreeData(pNode)
        } else if (op === 'move' || op === 'delete') {
          const node = findTreeNode(workFlowStore.treeData, key)
          const newTreeData = removeTreeNode(workFlowStore.treeData, curOpNode)
          workFlowStore.set({
            treeData: newTreeData,
          })
          const targetNode = findTreeNode(workFlowStore.treeData, targetNodeKey)
          fetchJobTreeData(targetNode, node)
        }
      },
    })
  }

  const handleJobModalClose = (created: boolean, op: 'create' | 'edit') => {
    setShowJobModal(false)
    if (created === true) {
      const pNode =
        op === 'create'
          ? curOpNode
          : findTreeNode(workFlowStore.treeData, curOpNode.pid)

      fetchJobTreeData(pNode)
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
            {renderRightMenu(curOpNode)}
          </div>
        }
      >
        <TreeWrapper ref={treeEl}>
          <Tree
            treeData={treeData}
            loadedKeys={loadedKeys}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            icon={renderIcon}
            switcherIcon={renderSwitcherIcon}
            onRightClick={onRightClick}
            draggable={(props) => {
              const { key } = props
              if (isRootNode(String(key))) {
                return false
              }
              return true
            }}
            dropIndicatorRender={({ dropLevelOffset }) => (
              <div
                tw="absolute bg-red-10 h-0.5 bottom-0 right-0 pointer-events-none"
                style={{ left: dropLevelOffset }}
              />
            )}
            loadData={fetchJobTreeData}
            onExpand={(keys) => setExpandedKeys(keys as string[])}
            onLoad={(keys) => workFlowStore.set({ loadedKeys: keys })}
            onSelect={(keys: (string | number)[], { selected, node }) => {
              const job = get(node, 'job')
              if (
                workFlowStore.curJob?.id !== job?.id &&
                workFlowStore.isDirty
              ) {
                workFlowStore.set({ nextJob: job })
                workFlowStore.showSaveConfirm(job.id, 'switch')
                return
              }
              if (node.isLeaf && node.jobMode === JobMode.RT) {
                workFlowStore.set({ curJob: job })
              } else if (node.expanded) {
                setExpandedKeys(expandedKeys.filter((key) => key !== node.key))
              } else {
                setExpandedKeys([...expandedKeys, node.key as string])
              }

              if (selected) {
                setSelectedKeys([String(keys[0])])
              }
            }}
          />
        </TreeWrapper>
      </Tippy>
      {showOpModal &&
        (() => {
          const { isLeaf, key } = curOpNode
          const opTxt = {
            create: `创建文件夹`,
            edit: `编辑文件夹`,
            move: `移动${curOpWord}${isLeaf ? `: ${key}` : ''}`,
          }[curOp]
          const okTxt = {
            create: '创建',
            edit: '保存',
            move: '移动',
          }[curOp]
          return (
            <Modal
              title={opTxt}
              visible
              appendToBody
              width={600}
              onCancel={() => setShowOpModal(false)}
              okText={okTxt}
              onOk={() => handleMutate(curOp)}
              confirmLoading={mutation.isLoading}
              showConfirmLoading={mutation.isLoading}
            >
              <Form layout="horizon" ref={form}>
                {(curOp === 'create' || curOp === 'edit') && (
                  <TextField
                    name="name"
                    label={<AffixLabel>文件夹名称</AffixLabel>}
                    validateOnBlur
                    defaultValue={curOp === 'create' ? '' : curOpNode.title}
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
                )}
                {curOp === 'move' && (
                  <>
                    <Field>
                      <Label>
                        <AffixLabel>{curOpWord}名称</AffixLabel>
                      </Label>
                      <Control>
                        <Label>{curOpNode.title}</Label>
                      </Control>
                    </Field>
                    <SelectTreeField
                      name="pid"
                      tw="z-50 transition-all"
                      css={[isOpened && tw`mb-40!`]}
                      label={<AffixLabel>目标文件夹</AffixLabel>}
                      placeholder="选择作业所在目录"
                      validateOnChange
                      treeHeight={160}
                      schemas={[
                        {
                          rule: (v: string) => {
                            return v !== ''
                          },
                          help: '请选择作业所在目录',
                          status: 'error',
                        },
                      ]}
                      icon={renderIcon}
                      switcherIcon={renderSwitcherIcon}
                      treeData={filterFolderOfTreeData(
                        cloneDeep(
                          treeData.filter(
                            (item) => item.key === curOpNode.rootKey
                          )
                        ),
                        curOpNode.key
                      )}
                      loadData={fetchJobTreeData}
                      loadedKeys={loadedKeys}
                      onLoad={(keys: string | number) =>
                        workFlowStore.set({ loadedKeys: keys })
                      }
                      value={targetNodeKey || ''}
                      onChange={(v: string) => {
                        setTargetNodeKey(v)
                      }}
                      onOpened={(v) => {
                        setIsOpened(v)
                        // console.log('opened', v)
                      }}
                    />
                  </>
                )}
              </Form>
            </Modal>
          )
        })()}
      {showConfirm &&
        (() => {
          const { isLeaf, title } = curOpNode
          return (
            <Confirm
              visible
              width={400}
              okText="删除"
              okType="danger"
              type={isLeaf ? 'error' : 'warn'}
              onCancel={() => setShowConfirm(false)}
              onOk={() => handleMutate('delete')}
              title={`确认删除${curOpWord}: ${curOpNode?.title}`}
              appendToBody
              confirmLoading={mutation.isLoading}
              showConfirmLoading={mutation.isLoading}
              footer={
                <>
                  <Button onClick={() => setShowConfirm(false)}>
                    {window.getText('LEGO_UI_CANCEL')}
                  </Button>
                  <Button
                    type="danger"
                    disabled={isLeaf ? !delBtnEnable : false}
                    loading={mutation.isLoading}
                    onClick={() => handleMutate('delete')}
                  >
                    删除
                  </Button>
                </>
              }
            >
              <div>
                {!isLeaf ? (
                  <span>
                    确认删除{curOpWord}：{title}
                    ，该操作无法撤回。确认删除吗？
                  </span>
                ) : (
                  <div>
                    <div tw="font-medium">{` 删除作业 ${title}
              会同时删除其所有的历史版本及所有的作业实例信息,
              同时将其从调度系统下线并强制停止正在运行中的作业实例`}</div>
                    <div tw="pt-6 space-y-1 ">
                      <div>
                        <span tw="label-required">
                          请在下方输入框中输入&quot;delete&quot;以确认操作
                        </span>
                      </div>
                      <div>
                        <Input
                          autoComplete="off"
                          type="text"
                          tw="w-40 border-line-dark"
                          placeholder="请输入"
                          onChange={(e, value) => {
                            setDelBtnEnable(value === 'delete')
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Confirm>
          )
        })()}
      {showJobModal && (
        <JobModal
          op={jobInfo.op}
          jobNode={jobInfo.node}
          jobType={jobInfo.type}
          onClose={handleJobModalClose}
        />
      )}
    </>
  )
})
export default JobTree
