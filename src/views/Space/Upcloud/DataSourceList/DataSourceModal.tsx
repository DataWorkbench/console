import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Modal, ModalStep, ModalContent } from 'components'
import { Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { useQueryClient } from 'react-query'
import tw from 'twin.macro'
import {
  useQuerySourceKind,
  useMutationSource,
  getSourceKey,
  useStore,
} from 'hooks'
import { useImmer } from 'use-immer'
import { Global, css } from '@emotion/react'
import { getHelpCenterLink } from 'utils'

import sourceListBg from 'assets/source-list.svg'

import MysqlImg from 'assets/svgr/sources/mysql.svg'
import PostgresqlImg from 'assets/svgr/sources/postgresql.svg'
// import S3Img from 'assets/svgr/sources/aws-s3.svg'
import ClickHouseImg from 'assets/svgr/sources/clickhouse.svg'
import HbaseImg from 'assets/svgr/sources/hbase.svg'
import KafkaImg from 'assets/svgr/sources/kafka.svg'
import FtpImg from 'assets/svgr/sources/ftp.svg'
import HdfsImg from 'assets/svgr/sources/hadoop.svg'
import DataSourceForm from './DataSourceForm'
import DbList from './DbList'

const resInfos = [
  {
    name: 'MySQL',
    img: <MysqlImg />,
    desc: '是一个完全托管的数据库服务，可使用世界上最受欢迎的开源数据库来部署云原生应用程序。',
  },
  {
    name: 'PostgreSQL',
    img: <PostgresqlImg />,
    desc: '开源的对象-关系数据库数据库管理系统，在类似 BSD 许可与 MIT 许可的 PostgreSQL 许可下发行。 ',
  },
  // { name: 'S3', img: <S3Img />, desc: '是一种面向 Internet 的存储服务。', source_type: 4, },
  {
    name: 'ClickHouse',
    img: <ClickHouseImg />,
    desc: '用于联机分析处理的开源列式数据库。 ClickHouse允许分析实时更新的数据。该系统以高性能为目标。',
  },
  {
    name: 'Hbase',
    img: <HbaseImg />,
    desc: 'HBase 是一个开源的非关系型分布式数据库，实现的编程语言为 Java。它可以对稀疏文件提供极高的容错率。 ',
  },
  {
    name: 'Kafka',
    img: <KafkaImg />,
    desc: '由Scala和Java编写，目标是为处理实时数据提供一个统一、高吞吐、低延迟的平台。',
  },
  {
    name: 'Ftp',
    img: <FtpImg />,
    desc: '用于联机分析处理的开源列式数据库。 ClickHouse允许分析实时更新的数据。该系统以高性能为目标。',
  },
  {
    name: 'HDFS',
    img: <HdfsImg />,
    desc: '由Scala和Java编写，目标是为处理实时数据提供一个统一、高吞吐、低延迟的平台。',
  },
]

interface DataSourceModalProp {
  onHide?: () => void
}

const DataSourceModal = observer(
  ({ onHide = () => {} }: DataSourceModalProp) => {
    const { regionId, spaceId } =
      useParams<{ regionId: string; spaceId: string }>()
    const {
      dataSourceStore: { op, opSourceList },
    } = useStore()

    const [state, setState] = useImmer({
      step: op === 'update' ? 1 : 0,
      dbName: '',
    })
    const getFormData = useRef()
    const queryClient = useQueryClient()
    const {
      status,
      data: kinds,
      refetch,
    } = useQuerySourceKind(regionId, spaceId)
    const mutation = useMutationSource()
    const curkind =
      op === 'create'
        ? // ? get(kinds, `[${state.dbName}]`)
          kinds?.find((k) => k.name === state.dbName)
        : kinds?.find((k) => k.source_type === opSourceList[0]?.source_type)

    const handleDbSelect = (name: string) => {
      setState((draft) => {
        draft.step = 1
        draft.dbName = name
      })
    }
    const handleSave = () => {
      if (getFormData?.current) {
        const data = (getFormData as any).current()
        if (data) {
          const params = {
            op,
            source_type: curkind.source_type,
            ...data,
          }
          if (op === 'update') {
            params.sourceId = opSourceList[0].source_id
          }
          mutation.mutate(params, {
            onSuccess: () => {
              onHide()
              const queryKey = getSourceKey()
              queryClient.invalidateQueries(queryKey)
            },
          })
        }
      }
    }
    const goStep = (i: number) => {
      setState((draft) => {
        draft.step = i
      })
    }
    return (
      <>
        <Global
          styles={css`
            .source-item-bg {
              background-image: url(${String(sourceListBg)});
            }
          `}
        />
        <Modal
          visible
          onCancel={onHide}
          orient="fullright"
          width={800}
          title={`${op === 'create' ? '新增' : '修改'}数据源: ${
            curkind ? curkind.name : ''
          }`}
          footer={
            <div tw="flex justify-end space-x-2">
              {state.step === 0 ? (
                <Button onClick={onHide}>取消</Button>
              ) : (
                <>
                  {op === 'create' && (
                    <Button className="mr-2" onClick={() => goStep(0)}>
                      上一步
                    </Button>
                  )}

                  <Button
                    loading={mutation.isLoading}
                    type="primary"
                    onClick={handleSave}
                  >
                    确定
                  </Button>
                </>
              )}
            </div>
          }
        >
          <ModalStep
            step={state.step}
            stepTexts={['选择数据库', '配置数据库']}
            css={state.step === 1 && tw`bg-white`}
          />
          <ModalContent css={state.step === 1 && tw`px-0 pt-0`}>
            {(() => {
              let curResInfo = null

              switch (status) {
                case 'loading':
                  return (
                    <div tw="h-80">
                      <Loading />
                    </div>
                  )
                case 'error':
                  return <Button onClick={() => refetch()}>重试</Button>
                case 'success':
                  if (state.step === 0) {
                    const items = kinds
                      .map(({ name }: { name: string }) =>
                        resInfos.find((info) => info.name === name)
                      )
                      .filter((n: any) => n)
                    return (
                      <>
                        <p tw="pt-2 pb-3 font-medium">
                          请选择一个数据库，您也可以参考
                          <a
                            href={getHelpCenterLink(
                              '/bigdata/dataplat/manual/data_up_cloud/source_data/data_summary/'
                            )}
                            target="_blank"
                            tw="text-link"
                            rel="noreferrer"
                          >
                            数据库文档
                          </a>
                          进行查看配置
                        </p>
                        <DbList
                          current={curkind}
                          items={items}
                          onChange={handleDbSelect}
                        />
                      </>
                    )
                  }
                  curResInfo = resInfos.find(
                    (info) => info.name === curkind.name
                  )
                  return (
                    curkind &&
                    curResInfo && (
                      <DataSourceForm
                        getFormData={getFormData}
                        // ref={form}
                        resInfo={{
                          ...curResInfo,
                          source_type: curkind.source_type,
                        }}
                      />
                    )
                  )
                default:
                  return null
              }
            })()}
          </ModalContent>
        </Modal>
      </>
    )
  }
)

export default DataSourceModal
