import { RadioButton, RadioGroup } from '@QCFE/lego-ui'
import Strategies from 'views/Space/Ops/DataIntegration/components/Monitor/Strategies'
import { useState } from 'react'

const Monitor = () => {
  const [ value ] = useState('0')
  return (
    <div>
      <RadioGroup>
        <RadioButton value="0"> 告警策略 </RadioButton>
        <RadioButton value="1"> 告警记录 </RadioButton>
      </RadioGroup>
      {value === '0' && <Strategies />}
    </div>
  )
}

export default Monitor
