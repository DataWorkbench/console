import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Control, RadioButton, RadioGroup } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import SpaceItem from './SpaceItem'
import styles from './styles.module.css'

const SpaceLists = ({ className, dataSource }) => {
  return (
    <div className={className}>
      <div className="flex justify-between mb-5 ">
        <div>
          <Button type="primary" className="font-medium px-5">
            创建工作空间
          </Button>
        </div>
        <div className="flex items-stretch">
          <Control className="has-icons-left mr-2">
            <Icon className="is-left" name="magnifier" />
            <Input type="text" placeholder="请输入工作名称/ID" />
          </Control>
          <Button className="mr-2">
            <Icon name="if-refresh" className="text-xl" />
          </Button>
          <Button className="mr-2">
            <Icon name="if-column" className="text-base" />
          </Button>
          <div className="border-l border-neutral-N3 mr-2" />
          <RadioGroup name="states" defaultValue="ReadOnly">
            <RadioButton value="ReadOnly">卡片视图</RadioButton>
            <RadioButton value="Write">列表视图</RadioButton>
          </RadioGroup>
        </div>
      </div>
      <div className="flex flex-wrap">
        {dataSource.map((ws, i) => {
          return (
            <div key={ws.id} className={`${styles.workspace} w-1/2`}>
              <SpaceItem data={ws} className={styles[`ws_${i % 5}`]} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

SpaceLists.propTypes = {
  className: PropTypes.string,
  dataSource: PropTypes.array,
}

export default SpaceLists
