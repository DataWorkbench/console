import tw, { css, styled } from 'twin.macro'
import { Tooltip } from 'components'
import { SourceKindImg } from './styled'

const ItemWrapper = styled('div')(({ selected }: { selected: boolean }) => [
  tw`flex p-3 border rounded-sm border-neut-2 cursor-pointer hover:border-green-11 transition-colors bg-no-repeat bg-right-bottom`,
  selected && tw`border-green-11`,
])

interface IDbList {
  items: any[]
  current: any
  onChange: (name: string) => void
}

const DbList = ({ items, current, onChange }: IDbList) => (
  <div tw="flex flex-wrap justify-between">
    {items.map(({ name, showname, desc }) => (
      <div
        onClick={() => onChange(name)}
        key={name}
        css={[tw`w-1/2 pb-4 odd-of-type:pr-2 even-of-type:pl-2`]}
      >
        <ItemWrapper
          className="group source-item-bg"
          selected={current?.name === name}
        >
          <div tw="w-10 flex-shrink-0">
            <SourceKindImg type={name} />
          </div>
          <div tw="flex-1 pl-2 leading-5">
            <div tw="font-medium group-hover:text-green-11">
              {showname || name}
            </div>
            <Tooltip
              content={<div onClick={(e) => e.stopPropagation()}>{desc}</div>}
              theme="darker"
              hasPadding
            >
              <div
                tw="text-neut-8 h-10 overflow-hidden overflow-ellipsis"
                css={css`
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                `}
              >
                {desc}
              </div>
            </Tooltip>
          </div>
        </ItemWrapper>
      </div>
    ))}
  </div>
)

export default DbList
