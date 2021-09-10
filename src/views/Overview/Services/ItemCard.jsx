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
    <div tw="h-full bg-white border-neut-1 shadow flex flex-col">
      <div tw="border-t-4 border-green-11 bg-neut-1 py-4 flex items-center justify-center">
        <Icon name={icon} />
        <span tw="ml-2">{text}</span>
      </div>
      <div tw="flex-1 font-normal text-neut-8 text-xs text-left pt-4 px-3">
        {desc}
        {moreLink && (
          <a href={moreLink} tw="text-link">
            了解更多
          </a>
        )}
      </div>
      <div tw="pb-5 text-center ">
        <Button
          type={enabled ? 'outlined' : 'default'}
          disabled={!enabled}
          tw="w-10/12"
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
