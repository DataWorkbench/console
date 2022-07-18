import { Tag } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Center, FlexBox, Tooltip } from 'components'
import tw, { css } from 'twin.macro'
import { SerializedStyles } from '@emotion/react'
import { xorBy } from 'lodash-es'

const addTagStyle = css`
  ${tw`bg-neut-1! border-neut-3!`}
`
// const DelayWrapper = (props: PropsWithChildren<{ time: number }>) => {
//   const { time, children } = props
//   const [delay, setDelay] = useState(true)
//   useEffect(() => {
//     setTimeout(() => {
//       setDelay(false)
//     }, time)
//   })
//   return (
//     delay ? null : <div key={Math.random().toString(32)}>{children}</div>
//   ) as any
// }

interface ITagsProps {
  data: Record<string, any>
  list: Record<string, any>[]
  handleAdd: (record: Record<string, any>, roleId: string) => void
  handleRemove: (record: Record<string, any>, roleId: string, reset: Function) => void
}

const Tags = (props: ITagsProps) => {
  const { handleRemove, data, list, handleAdd } = props
  const { system_roles: systemRoles } = data
  const addTag = (text?: string | number, tagStyle?: SerializedStyles) => (
    <Tag
      css={[tw`text-neut-15!`, tagStyle]}
      className={systemRoles.length > 2 ? 'tag-has-more' : 'tag-no-more'}
    >
      <Center>
        <Icon name="add" size={14} css={[tw`text-neut-15! m-0!`]} />
        {!!text && <span tw="ml-1">{text}</span>}
      </Center>
    </Tag>
  )
  const rest = xorBy(systemRoles, list, 'id')

  const getAddText = (len: number) => {
    if (len < 2) {
      return '添加角色'
    }
    return len - 2
  }
  return (
    <FlexBox tw="gap-1">
      {systemRoles.slice(0, 2).map((role: any) => (
          <Tag
            closable
            css={[tw`text-neut-15! text-sm`]}
            onClose={(e: { preventDefault: Function }) =>
              handleRemove(data, role.id, () => e.preventDefault())
            }
            key={role.id}
          >
            {role.name}
          </Tag>
        ))}
      <Tooltip
        key={systemRoles.length}
        theme="light"
        // interactive
        // appendTo="parent"
        trigger="click"
        arrow={false}
        placement="bottom"
        content={
          <div
            tw="py-1 min-w-[140px]"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {systemRoles.slice(2).map((role: Record<string, any>) => (
                <div tw="flex items-center pl-3 hover:bg-neut-1 h-8" key={role.id}>
                  <Tag
                    closable
                    css={[tw`text-neut-15! text-sm`]}
                    onClose={(e: { preventDefault: Function }) =>
                      handleRemove(data, role.id, () => e.preventDefault())
                    }
                    key={role.id}
                  >
                    {role.name}
                  </Tag>
                </div>
              ))}

            {!!rest.length && (
              <Tooltip
                theme="light"
                interactive
                trigger="click"
                // appendTo="parent"
                arrow={false}
                placement="right"
                hideOnClick
                twChild={tw`w-full`}
                css={css`
                  transform: translateX(-16px);
                `}
                content={
                  <div
                    tw="py-1 min-w-[140px]"
                    // onClick={(e) => {
                    //   e.stopPropagation()
                    //   e.preventDefault()
                    // }}
                  >
                    {xorBy(systemRoles, list, 'id').map((role: Record<string, any>) => (
                        <div tw="flex items-center pl-3 hover:bg-neut-1 h-8" key={role.id}>
                          <Tag
                            css={[tw`text-neut-15! text-sm`, addTagStyle]}
                            key={role.id}
                            onClick={() => {
                              handleAdd(data, role.id)
                            }}
                          >
                            <Icon name="add" size={14} css={[tw`text-neut-15! m-0!`]} />
                            {role.name}
                          </Tag>
                        </div>
                      ))}
                  </div>
                }
              >
                <div tw="flex items-center pl-3 hover:bg-neut-1 h-8">
                  {addTag('添加角色', addTagStyle)}
                </div>
              </Tooltip>
            )}
          </div>
        }
      >
        {addTag(getAddText(systemRoles.length), addTagStyle)}
      </Tooltip>
    </FlexBox>
  )
}

export default Tags
