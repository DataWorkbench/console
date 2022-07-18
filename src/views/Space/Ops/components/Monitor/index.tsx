import { RadioButton, RadioGroup } from '@QCFE/lego-ui'
import Strategies from 'views/Space/Ops/components/Monitor/Strategies'
import { useState } from 'react'
import MonitorHistory from 'views/Space/Ops/components/Monitor/MonitorHistory'

const Monitor = () => {
  const [value, setValue] = useState('0')
  return (
    <div tw="w-full">
      <RadioGroup value={value} onChange={setValue}>
        <RadioButton value="0"> 告警策略 </RadioButton>
        <RadioButton value="1"> 告警记录 </RadioButton>
      </RadioGroup>
      {value === '0' && <Strategies />}
      {value === '1' && <MonitorHistory />}
    </div>
  )
}

export default Monitor
