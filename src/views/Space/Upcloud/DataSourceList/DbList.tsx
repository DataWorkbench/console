import tw from 'twin.macro'
import DbItem from './DbItem'

const DbList = ({ items, onChange }) => {
  return (
    <div tw="flex flex-wrap">
      {items.map((item, i: number) => (
        <div
          onClick={() => onChange(i)}
          key={item.name}
          css={[tw`w-1/3 pb-4`, (i + 1) % 3 && tw`pr-4`]}
        >
          <DbItem {...item} />
        </div>
      ))}
    </div>
  )
}

export default DbList
