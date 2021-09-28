import tw from 'twin.macro'

const ItemWrapper = tw.div`flex p-3 border rounded-sm border-neut-2 cursor-pointer hover:border-green-11`

const DbList = ({ items, onChange }) => {
  const renderItem = ({
    name,
    img,
    desc,
  }: {
    name: string
    img?: string
    desc?: string
  }) => (
    <ItemWrapper className="group">
      <div tw="w-10 flex-shrink-0">
        <img tw="w-full h-auto" src={img} alt="" />
      </div>
      <div tw="flex-1 pl-2 leading-5">
        <div tw="font-medium group-hover:text-green-11">{name}</div>
        <div tw="text-neut-8 h-10 overflow-hidden">{desc}</div>
      </div>
    </ItemWrapper>
  )

  return (
    <div tw="flex flex-wrap">
      {items.map((item, i: number) => (
        <div
          onClick={() => onChange(i)}
          key={item.name}
          css={[tw`w-1/3 pb-4`, (i + 1) % 3 && tw`pr-4`]}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}

export default DbList
