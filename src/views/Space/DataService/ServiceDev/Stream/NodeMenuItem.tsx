import tw from 'twin.macro'
import { useDrag } from 'react-dnd'

const NodeMenuItem = ({ item }: { item: any }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    options: {
      dropEffect: 'copy'
    },
    item,
    // end: (item, monitor) => {
    //   const dropResult = monitor.getDropResult()
    //   console.log(item, dropResult)
    // },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))
  return (
    <li
      ref={drag}
      css={[tw`pl-2 flex cursor-pointer hover:bg-neut-13`, isDragging ? tw`opacity-50` : '']}
    >
      <div tw="w-6">
        <span
          css={[tw`p-1 rounded-sm`, item.type === 'table' ? tw`bg-[#229CE9]` : tw`bg-[#934BC5]`]}
        >
          {item.type === 'table' ? 'ch' : item.iname}
        </span>
      </div>
      <span tw="ml-2">{item.name}</span>
    </li>
  )
}

export default NodeMenuItem
