import { useEffect, useState } from 'react'
import { useToggle } from 'react-use'
import { observer } from 'mobx-react-lite'
import { css, styled } from 'twin.macro'
import { get, toLower } from 'lodash-es'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  PageTab,
  Icon,
  Button,
  Loading,
  Table,
  Message,
  ToolBar,
  ToolBarLeft,
} from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import { ContentBox, FlexBox } from 'components'
import DataSourceModal from './DataSourceModal'
import DataEmpty from './DataEmpty'

const tabs = [
  {
    title: '数据源',
    description:
      '数据源主要用于数据集成过程中 Reader 和 Writer 的对象，您可以在数据源管理页面查看、新增及批量新增数据源。指定的整个数据库全部或者部分表一次性的全部同步至MySQL，并且支持后续的实时增量同步模式，将新增数据持续同步至 MySQL。',
    icon: 'blockchain',
    helpLink: '/',
  },
]
const columns = [
  {
    title: '数据源名称/id',
    dataIndex: 'info.sourceid',
    render: (v, { info }) => (
      <FlexBox>
        <Icon name="blockchain" size="medium" />
        <div>
          <div>{info.name}</div>
          <div className="text-neut-8">{v}</div>
        </div>
      </FlexBox>
    ),
  },
  {
    title: '数据源类型',
    dataIndex: 'info.sourcetype',
  },
  {
    title: 'url',
    render: (v, { info }) => {
      const url = get(info, `url.${toLower(info.sourcetype)}`, {})
      return (
        <span>
          {url.host}:{url.port}
        </span>
      )
    },
  },
  {
    title: '用户名',
    dataIndex: 'info.name',
    render: () => '',
  },
  {
    title: '数据源描述',
    dataIndex: 'info.comment',
  },
  {
    title: '创建时间',
    dataIndex: 'info.updatetime',
    render: (field) => dayjs(field).format('YYYY-MM-DD HH:mm:ssZ'),
  },
  {
    title: '操作',
    key: 'table_actions',
    dataIndex: '',
    width: 130,
    render: () => (
      <div>
        <Button type="text" className="px-1 !text-link">
          表
        </Button>
        <Button type="text" className="px-1 !text-link">
          编辑
        </Button>
        <Button type="text" className="px-1 !text-link">
          删除
        </Button>
      </div>
    ),
  },
]

const Root = styled('div')(() => [
  css`
    & > :first-child {
      margin-bottom: 20px;
    }
  `,
])

const DataSourceList = observer(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, toggleLoadding] = useState(true)
  const [show, toggleShow] = useToggle(false)
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const {
    dataSourceStore,
    dataSourceStore: { sourceList },
  } = useStore()
  useEffect(() => {
    toggleLoadding(true)
    const params = { regionId, spaceId, offset: 0 }
    dataSourceStore.load(params).finally(() => {
      toggleLoadding(false)
    })
  }, [spaceId, regionId, dataSourceStore])
  if (loading) {
    return (
      <ContentBox tw="bg-white">
        <Loading spinning={loading} />
      </ContentBox>
    )
  }

  return (
    <>
      {sourceList?.length ? (
        <Root>
          <PageTab tabs={tabs} />
          <ToolBar tw="bg-white">
            <ToolBarLeft>
              <Button type="primary" onClick={() => toggleShow(true)}>
                <Icon name="add" />
                新增数据源
              </Button>
              <Button
                type="default"
                disabled
                onClick={() => Message.info('删除')}
              >
                <Icon name="add" />
                删除
              </Button>
            </ToolBarLeft>
          </ToolBar>
          <Table
            selectType="checkbox"
            dataSource={sourceList}
            columns={columns}
            rowKey="id"
            selectedRowKeys={selectedRowKeys}
            onSelect={(rowKeys) => setSelectedRowKeys(rowKeys)}
          />
        </Root>
      ) : (
        <DataEmpty onAddClick={() => toggleShow(true)} />
      )}
      {show && <DataSourceModal show={show} onHide={() => toggleShow(false)} />}
    </>
  )
})

export default DataSourceList
