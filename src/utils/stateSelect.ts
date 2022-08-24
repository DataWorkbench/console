import { BehaviorSubject, distinctUntilChanged, map, scan } from 'rxjs'
import { isEqual, merge } from 'lodash-es'
import { useEffect, useState } from 'react'

const select = <T extends Partial<Record<string, any>>>(subject: BehaviorSubject<T>) => {
  const update = (config: Partial<T>) => {
    subject.next(config as any)
  }

  const state = subject.pipe(
    scan((acc, v) => {
      return merge(acc, v)
    })
  )

  return (selector: (state: any) => any = (d) => d) =>
    () => {
      const [value, setValue] = useState(selector(subject.getValue()))
      useEffect(() => {
        const sub = state
          .pipe(
            map(selector),
            distinctUntilChanged((previous, current) => {
              return isEqual(previous, current)
            })
          )
          .subscribe(setValue)
        return () => {
          sub.unsubscribe()
        }
      }, [])

      return [value, update]
    }
}

export default select
