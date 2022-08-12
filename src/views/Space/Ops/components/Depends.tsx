import tw, { styled } from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'

const itemStyle = (isDelete: boolean) => [
  tw`flex items-center px-2 gap-1 leading-6 mb-2`,
  !isDelete && tw`bg-neut-13`,
  isDelete && tw`bg-[rgba(207, 59, 55, 0.1)] border border-red-10`
]

const Empty = styled.div`
  & {
    ${tw` w-[72px] h-[82px] overflow-hidden`}
    -webkit-transform: rotate(60deg);
  }

  & div,
  & p {
    ${tw`inline-block w-full h-full overflow-hidden`}
  }

  & p {
    ${tw`inline-flex items-center justify-center m-0 p-0 bg-line-dark`}
  }

  & > div {
    -webkit-transform: rotate(-120deg);
  }

  & > div > div {
    -webkit-transform: rotate(60deg);
  }
`
export default function Depends({ data }: { data?: Record<string, any> }) {
  // const data = {
  //   files: ['asdfas', 'adfasf', 'adfasd'],
  //   delete_files: ['dfad', 'adfasdf', 'dsafasdf'],
  // }
  const isEmpty = !data?.files?.length && !data?.delete_files?.length

  if (isEmpty) {
    return (
      <FlexBox tw="w-full flex-col items-center gap-3 pt-14">
        <Empty>
          <div>
            <div>
              <p>
                <Icon
                  name="coding"
                  color={{
                    primary: '#fff',
                    secondary: '##949ea9'
                  }}
                  size={40}
                />
              </p>
            </div>
          </div>
        </Empty>
        <div tw="text-neut-8">发布作业时未添加依赖资源（非必须）</div>
      </FlexBox>
    )
  }
  return (
    <div>
      {!!data?.files?.length &&
        data.files.map((file: any) => (
          <div css={itemStyle(false)} key={file}>
            <Icon
              size={20}
              name="coding"
              type="light"
              color={{
                primary: '#219861',
                secondary: '#8EDABD'
              }}
            />
            <span tw="text-white">{file}</span>
          </div>
        ))}
      {!!data?.delete_files?.length && (
        <div>
          {data.delete_files.map((file: any) => (
            <div css={itemStyle(true)} key={file}>
              <Icon
                size={20}
                name="coding"
                type="light"
                color={{
                  primary: '#219861',
                  secondary: '#8EDABD'
                }}
              />
              <span tw="text-white">{file}</span>
            </div>
          ))}
          <div tw="text-red-10">红框内的资源已被删除</div>
        </div>
      )}
    </div>
  )
}
