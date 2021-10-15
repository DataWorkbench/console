import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { Button, Form, Loading } from '@QCFE/qingcloud-portal-ui'
import { useQueryClient } from 'react-query'
import {
  useQuerySourceKind,
  useMutationSource,
  getSourceKey,
  useStore,
} from 'hooks'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'

import MysqlImg from 'assets/svgr/sources/mysql.svg'
import PostgresqlImg from 'assets/svgr/sources/postgresql.svg'
import S3Img from 'assets/svgr/sources/aws-s3.svg'
import ClickHouseImg from 'assets/svgr/sources/clickhouse.svg'
import HbaseImg from 'assets/svgr/sources/hbase.svg'
import KafkaImg from 'assets/svgr/sources/kafka.svg'
import FtpImg from 'assets/svgr/sources/ftp.svg'
import HdfsImg from 'assets/svgr/sources/hadoop.svg'
import CreateForm from './CreateForm'
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
  { name: 'S3', img: <S3Img />, desc: '是一种面向 Internet 的存储服务。' },
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
      dbIndex: -1,
    })
    const form = useRef<Form>()
    const queryClient = useQueryClient()
    const {
      status,
      data: kinds,
      refetch,
    } = useQuerySourceKind(regionId, spaceId)
    const mutation = useMutationSource()
    const curkind =
      op === 'create'
        ? get(kinds, `[${state.dbIndex}]`)
        : kinds?.find((k) => k.name === opSourceList[0]?.sourcetype)

    const handleDbSelect = (i: number) => {
      setState((draft) => {
        draft.step = 1
        draft.dbIndex = i
      })
    }
    const handleSave = () => {
      const formElem = form.current
      if (formElem?.validateForm()) {
        const { name, comment, ...rest } = formElem.getFieldsValue()
        const sourcetype: string = curkind.name
        // get(kinds, `[${state.dbIndex}].name`)
        const params = {
          op,
          regionId,
          spaceId,
          name,
          comment,
          sourcetype,
          url: {
            [sourcetype.toLowerCase()]: rest,
          },
        }
        if (op === 'update') {
          params.sourceId = opSourceList[0].sourceid
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
    const goStep = (i: number) => {
      setState((draft) => {
        draft.step = i
      })
    }

    return (
      <Modal
        onHide={onHide}
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
        <ModalStep step={state.step} stepTexts={['选择数据库', '配置数据库']} />
        <ModalContent>
          {(() => {
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
                  const items = kinds.map(({ name }) =>
                    resInfos.find((info) => info.name === name)
                  )
                  return (
                    <>
                      <p>
                        请选择一个数据库，您也可以参考
                        <a href="##" className="text-link">
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

                return (
                  curkind && (
                    <CreateForm
                      ref={form}
                      resInfo={resInfos.find(
                        (info) => info.name === curkind.name
                      )}
                    />
                  )
                )
              default:
                return null
            }
          })()}
        </ModalContent>
      </Modal>
    )
  }
)

export default DataSourceModal
