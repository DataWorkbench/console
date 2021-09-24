import tw from 'twin.macro'

interface IDbItemProps {
  name: string
  desc: string
  image: string
}

const Root = tw.div`flex p-3 border rounded-sm border-neut-2 cursor-pointer hover:border-green-11`

function DbItem({ name, desc, image }: IDbItemProps) {
  return (
    <Root className="group">
      <div tw="w-10 flex-shrink-0">
        <img tw="w-full h-10" src={`data:image/gif;base64,${image}`} alt="" />
      </div>
      <div tw="flex-1 pl-2 leading-5">
        <div tw="font-medium group-hover:text-green-11">{name}</div>
        <div tw="text-neut-8 h-10 overflow-hidden">{desc}</div>
      </div>
    </Root>
  )
}

export default DbItem
