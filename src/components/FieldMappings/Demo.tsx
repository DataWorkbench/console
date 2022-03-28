import { HelpCenterLink } from 'components/Link'
import { FieldMappings } from './FieldMappings'

const Demo = () => {
  return (
    <FieldMappings
      onChange={(v) => {
        console.log(v)
      }}
      topHelp={<HelpCenterLink href="###">字段映射</HelpCenterLink>}
      mappings={[
        // ['left_1', 'right_1'],
        // ['left_2', 'right_2'],
        // ['right_1', 'left_1'],
        ['left_age', 'right_age'],
      ]}
      rightFields={[
        {
          name: 'name',
          label: 'name',
          type: 'string',
          required: true,
          uuid: 'right_name',
        },
        {
          name: 'age',
          label: 'age',
          type: 'number',
          required: true,
          uuid: 'right_age',
        },
        {
          name: 'id',
          label: 'id',
          type: 'number',
          required: true,
          uuid: 'right_id',
        },
      ]}
      leftFields={[
        {
          name: 'name1',
          label: 'name',
          type: 'string',
          required: true,
          uuid: 'left_name1',
        },
        {
          name: 'age',
          label: 'age',
          type: 'number',
          required: true,
          uuid: 'left_age',
        },
        {
          name: 'xxx',
          label: 'xxx',
          type: 'number',
          required: true,
          uuid: 'left_xxx',
        },
        {
          name: 'id',
          label: 'id',
          type: 'number',
          required: true,
          uuid: 'left_id',
        },
      ]}
    />
  )
}

export default Demo
