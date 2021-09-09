import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'

const propTypes = {
  item: PropTypes.object,
}

function ItemCard({ item: { name, icon, text, desc, enabled, moreLink } }) {
  const { overViewStore } = useStore()
  const handleClick = () => {
    overViewStore.set({
      showSpaceModal: true,
      curItemName: name,
    })
  }
  return (
    <div tw="tw-h-full tw-bg-white tw-border-neut-1 tw-shadow tw-flex tw-flex-col">
      <div tw="tw-border-t-4 tw-border-green-11 tw-bg-neut-1 tw-py-4 tw-flex tw-items-center tw-justify-center">
        <Icon name={icon} />
        <span tw="tw-ml-2">{text}</span>
      </div>
      <div tw="tw-flex-1 tw-font-normal tw-text-neut-8 tw-text-xs tw-text-left tw-pt-4 tw-px-3">
        {desc}
        {moreLink && (
          <a href={moreLink} tw="tw-text-link">
            了解更多
          </a>
        )}
      </div>
      <div tw="tw-pb-5 tw-text-center ">
        <Button
          type={enabled ? 'outlined' : 'default'}
          disabled={!enabled}
          tw="tw-w-10/12"
          onClick={handleClick}
        >
          {enabled ? '开始使用' : '敬请期待'}
        </Button>
      </div>
    </div>
  )
}

ItemCard.propTypes = propTypes

export default ItemCard
