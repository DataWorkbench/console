import React, { useState } from 'react'
import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import DataSourceModal from './DataSourceModal'
import styles from '../../styles.module.css'

function DataSourceList() {
  const [show, setShow] = useState(false)
  return (
    <div className="tw-bg-white tw-rounded-sm tw-m-5">
      <div className="tw-pt-20 tw-pb-20 tw-mx-auto tw-w-9/12">
        <div className="tw-text-center">
          <Icon name="blockchain" size={60} className="tw-mb-3" />
          <div className="tw-mb-3">暂无数据源</div>
          <p className="tw-mx-8 tw-mb-3">
            数据源主要用于数据集成过程中 Reader 和 Writer
            的对象，您可以在数据源管理页面查看、新增及批量新增数据源。指定的整个数据库全部或者部分表一次性的全部同步至MySQL，并且支持后续的实时增量同步模式，将新增数据持续同步至
            MySQL。
          </p>
          <div>
            <Button
              className="tw-mr-4"
              type="primary"
              onClick={() => setShow(true)}
            >
              <Icon name="add" type="light" />
              新增数据源
            </Button>
            <Button>
              <Icon name="if-book" type="light" />
              使用指南
            </Button>
          </div>
        </div>
      </div>
      <div className="tw-border-t tw-border-neutral-N3 tw-py-5">
        <div className="tw-pl-9 tw-pb-6 tw-text-xl">使用指引</div>
        <div className="tw-flex tw-justify-center tw-px-5">
          <div className="tw-w-48 tw-flex-none">
            <div>
              <span className={styles.guideNum}>1</span>
              <span className="tw-font-medium tw-text-base">
                资源规划与配置
              </span>
            </div>
            <div className="tw-pt-5">
              本文为您介绍资源组的基本概念和分类，以及连通性和性能问题，通过对比各类资源组，助力您根据自身需求选择更合适的资源组类型。查看
            </div>
          </div>
          <div className="tw-w-16">&nbsp;</div>
          <div className="tw-w-48 tw-flex-none">
            <div className="tw-flex tw-items-center">
              <span className={styles.guideNum}>2</span>
              <span className="tw-font-medium tw-text-base">
                资源规划与配置
              </span>
            </div>
            <div className="tw-pt-5">
              本文为您介绍资源组的基本概念和分类，以及连通性和性能问题，通过对比各类资源组，助力您根据自身需求选择更合适的资源组类型。查看
            </div>
          </div>
          <div className="tw-w-16">&nbsp;</div>
          <div className="tw-w-48 tw-flex-none">
            <div className="tw-flex tw-items-center">
              <span className={styles.guideNum}>3</span>
              <span className="tw-font-medium tw-text-base">
                资源规划与配置
              </span>
            </div>
            <div className="tw-pt-5">
              本文为您介绍资源组的基本概念和分类，以及连通性和性能问题，通过对比各类资源组，助力您根据自身需求选择更合适的资源组类型。查看
            </div>
          </div>
          <div className="tw-w-16">&nbsp;</div>
          <div className="tw-w-48 tw-flex-none">
            <div className="tw-flex tw-items-center">
              <span className={styles.guideNum}>4</span>
              <span className="tw-font-medium tw-text-base">
                资源规划与配置
              </span>
            </div>
            <div className="tw-pt-5">
              本文为您介绍资源组的基本概念和分类，以及连通性和性能问题，通过对比各类资源组，助力您根据自身需求选择更合适的资源组类型。查看
            </div>
          </div>
        </div>
      </div>
      <DataSourceModal show={show} onHide={() => setShow(false)} />
    </div>
  )
}

export default DataSourceList
