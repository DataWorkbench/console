import { useRef, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import { Modal, ModalStep, ModalContent, AffixLabel, Tooltip } from 'components'
import { Icon, Form, Button } from '@QCFE/qingcloud-portal-ui'
import { get, assign } from 'lodash-es'
import tw, { css, styled, theme } from 'twin.macro'
import { useMutationStreamJob, getFlowKey } from 'hooks'
import { useQueryClient } from 'react-query'

import NodeTypeImg from 'assets/svgr/sourcetype_node.svg'
import SQLTypeImg from 'assets/svgr/sourcetype_sql.svg'
import CodeTypeImg from 'assets/svgr/sourcetype_code.svg'
import { Control, Field, Label } from '@QCFE/lego-ui'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import { nameMatchRegex, strlen } from 'utils/convert'

const { TextField, TextAreaField } = Form

const ScheduleItem = styled('div')(
  ({
    selected,
    disabled = false,
  }: {
    selected?: boolean
    disabled?: boolean
  }) => [
    tw`flex flex-col w-1/3 rounded border-2 overflow-hidden border-neut-13 transition-colors`,
    disabled ? tw`cursor-not-allowed` : tw`cursor-pointer`,
    selected &&
      css`
        ${tw`border-green-11`}
        svg {
          path:nth-of-type(1) {
            fill-opacity: 0.8;
          }
          stop {
            stop-color: ${theme('colors.green.11')};
          }
        }
      `,
    css`
      &:hover {
        svg {
          path:nth-of-type(1) {
            fill-opacity: 0.8;
          }
        }
      }
    `,
  ]
)

const CodeButton = styled(Button)(({ selected }: { selected?: boolean }) => [
  // tw`bg-neut-17! hover:border-white! hover:bg-neut-18!`,
  selected &&
    tw`border-green-11! hover:border-green-11! text-green-11! font-medium bg-neut-17!`,
  selected &&
    css`
      svg {
        ${tw`text-green-11`}
      }
    `,
])

const JobModal = ({
  job,
  onCancel,
}: {
  job: any
  onCancel: (data?: any) => void
}) => {
  const form = useRef<Form>(null)
  const [show, setShow] = useState(false)
  const [cluster, setCluster] = useState(null)
  const [params, setParams] = useImmer({
    step: job ? 1 : 0,
    scheType: job ? job.type : 2,
  })

  const mutation = useMutationStreamJob()
  const queryClient = useQueryClient()

  const handleCancel = (data: any) => {
    setParams((draft) => {
      draft.step = 0
    })
    if (onCancel) {
      onCancel(data)
    }
  }

  const handleNext = () => {
    if (params.step === 0) {
      setParams((draft) => {
        draft.step = 1
      })
    } else if (form.current?.validateForm()) {
      const fields = form.current.getFieldsValue()
      mutation.mutate(
        assign(
          {
            op: job ? 'update' : 'create',
            type: params.scheType,
            ...fields,
          },
          job && { jobId: job.id },
          cluster && { cluster_id: cluster.id }
        ),
        {
          onSuccess: (data) => {
            handleCancel(data)
            queryClient.invalidateQueries(getFlowKey())
          },
        }
      )
    }
  }

  const scheduleTypes = useMemo(
    () => [
      {
        type: 2,
        title: 'SQL??????',
        disp: '?????? Flink SQL ?????????????????????????????????????????????????????????????????????',
        icon: <SQLTypeImg />,
      },
      {
        type: -1,
        subType: [3, 4, 5],
        title: '????????????',
        subItems: [
          {
            type: 3,
            text: 'JAR',
            icon: 'java',
            desc: 'JAR ????????????????????? java ?????? scala ???',
          },
          { type: 4, text: 'Python', icon: 'python', desc: '????????????' },
          // { type: 5, text: 'Scala', icon: 'coding' },
        ],
        icon: <CodeTypeImg />,
      },
      {
        type: 1,
        title: '??????????????????????????????',
        disp: '????????????????????????????????? Flink ??????????????????????????????????????????????????????????????????????????????',
        icon: <NodeTypeImg />,
      },
    ],
    []
  )
  return (
    <>
      <Modal
        visible
        title={`${job ? '??????' : '??????'}??????`}
        width={job ? 600 : 1200}
        maskClosable={false}
        onCancel={handleCancel}
        footer={
          <div tw="flex justify-end space-x-2">
            {params.step === 0 || job ? (
              <Button onClick={handleCancel}>??????</Button>
            ) : (
              <Button
                onClick={() =>
                  setParams((draft) => {
                    draft.step = 0
                  })
                }
              >
                ?????????
              </Button>
            )}
            <Button
              type="primary"
              loading={mutation.isLoading}
              onClick={handleNext}
              disabled={params.scheType === 0}
            >
              {params.step === 0 ? '?????????' : '??????'}
            </Button>
          </div>
        }
      >
        {!job && (
          <ModalStep
            step={params.step}
            sameLine
            stepTexts={['????????????', '????????????']}
            stepClassName={tw`w-80`}
          />
        )}
        <ModalContent>
          {params.step === 0 && (
            <div>
              <div tw="mb-4">?????????????????????????????????</div>
              <div tw="flex justify-between  space-x-5 2xl:space-x-9 mb-5 2xl:mb-10">
                {scheduleTypes.map(
                  ({ type, subType, title, disp, subItems, icon }) => {
                    const selected =
                      params.scheType === type ||
                      subType?.includes(params.scheType)
                    return (
                      <ScheduleItem
                        key={type}
                        className="group"
                        selected={selected}
                        disabled={type === 1}
                        onClick={() => {
                          if (type !== 1) {
                            let tp = type
                            if (type === -1) {
                              tp = [3, 4, 5].includes(params.scheType)
                                ? params.scheType
                                : 3
                            }
                            setParams((draft) => {
                              draft.scheType = tp
                            })
                          }
                        }}
                      >
                        <div
                          css={[
                            tw`bg-neut-17 group-hover:bg-neut-18 h-40 2xl:h-52 flex justify-center items-center`,
                            selected && tw`bg-neut-18`,
                          ]}
                        >
                          {icon}
                        </div>
                        <div
                          css={[
                            tw`bg-neut-16 group-hover:bg-neut-15 py-3 px-3 2xl:py-5 2xl:pl-5 text-base flex-1`,
                            selected && tw`bg-neut-15`,
                          ]}
                        >
                          <div tw="font-semibold">{title}</div>
                          <div tw="mt-2 text-neut-8 space-x-2">
                            {disp ||
                              subItems?.map((item) => (
                                <Tooltip
                                  key={item.type}
                                  content={item.desc}
                                  theme="light"
                                  hasPadding
                                >
                                  <CodeButton
                                    disabled={item.type !== 3}
                                    selected={params.scheType === item.type}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setParams((draft) => {
                                        draft.scheType = item.type
                                      })
                                    }}
                                  >
                                    <Icon name={item.icon} type="light" />
                                    {item.text}
                                  </CodeButton>
                                </Tooltip>
                              ))}
                          </div>
                        </div>
                      </ScheduleItem>
                    )
                  }
                )}
              </div>
            </div>
          )}
          {params.step === 1 && (
            <div tw="flex justify-center mb-10">
              <Form layout="vertical" ref={form}>
                <TextField
                  autoComplete="off"
                  name="name"
                  label={<AffixLabel>????????????</AffixLabel>}
                  placeholder='??????????????????????????? ??? "_"?????????2???128'
                  validateOnChange
                  defaultValue={get(job, 'name', '')}
                  schemas={[
                    {
                      rule: {
                        required: true,
                        matchRegex: nameMatchRegex,
                      },
                      help: '??????????????????????????????????????????_???,????????????_???????????????',
                      status: 'error',
                    },
                    {
                      rule: (value: string) => {
                        const l = strlen(value)
                        return l >= 2 && l <= 128
                      },
                      help: '??????????????????????????? ??? "_"?????????2???128',
                      status: 'error',
                    },
                  ]}
                />
                {!job && (
                  <Field>
                    <Label>????????????</Label>
                    <Control tw="space-x-2">
                      <Button onClick={() => setShow(true)}>
                        <Icon name="pod" />
                        <span tw="ml-1!">
                          {cluster ? (
                            <>
                              {cluster.name}
                              <span tw="text-neut-8">({cluster.id})</span>
                            </>
                          ) : (
                            '????????????'
                          )}
                        </span>
                      </Button>
                      {cluster && (
                        <Button
                          type="black"
                          onClick={() => setCluster(null)}
                          css={[
                            css`
                              .icon:hover {
                                ${tw`bg-neut-13!`}
                              }
                            `,
                          ]}
                        >
                          <Icon name="close" size={20} />
                        </Button>
                      )}
                    </Control>
                  </Field>
                )}
                <TextAreaField
                  name="desc"
                  label="??????"
                  defaultValue={get(job, 'desc', '')}
                  validateOnChange
                  placeholder="?????????????????????"
                  schemas={[
                    {
                      rule: (value: string) => {
                        const l = strlen(value)
                        return l <= 1024
                      },
                      help: '??????????????????1024??????',
                      status: 'error',
                    },
                  ]}
                />
              </Form>
            </div>
          )}
        </ModalContent>
      </Modal>
      <div css={!show && tw`hidden`}>
        <ClusterTableModal
          onCancel={() => setShow(false)}
          onOk={(clusterItem) => {
            if (clusterItem) {
              setCluster(clusterItem)
            }
            setShow(false)
          }}
          selectedIds={cluster ? [cluster.id] : []}
        />
      </div>
    </>
  )
}

export default JobModal
