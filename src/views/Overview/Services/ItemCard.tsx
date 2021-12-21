import { Center, HelpCenterLink } from 'components'
import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'

interface ItemCardTypes {
  item: {
    [propName: string]: any
  }
}

const ItemCard = ({ item }: ItemCardTypes) => {
  const { name, icon, text, desc, enabled, moreLink } = item
  const { overViewStore } = useStore()
  const handleClick = () => {
    overViewStore.set({
      showSpaceModal: true,
      curItemName: name,
    })
  }
  return (
    <div tw="h-full bg-white border-neut-1 shadow flex flex-col">
      <Center tw="border-t-4 border-green-11 bg-neut-1 py-4">
        <Icon name={icon} />
        <span tw="ml-2">{text}</span>
      </Center>
      <div tw="flex-1 font-normal text-neut-8 text-xs text-left pt-4 px-3 whitespace-pre-line">
        {desc}
        {moreLink && <HelpCenterLink href={moreLink}>了解更多</HelpCenterLink>}
      </div>
      <Center tw="pb-5">
        <Button
          type={enabled ? 'outlined' : 'default'}
          disabled={!enabled}
          tw="w-10/12"
          onClick={handleClick}
        >
          {enabled ? '开始使用' : '敬请期待'}
        </Button>
      </Center>
    </div>
  )
}

export default ItemCard
