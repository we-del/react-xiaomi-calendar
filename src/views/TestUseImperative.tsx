import { useEffect, useState, useRef } from 'react'

export default function TestUseImperative() {
  const [count, setCount] = useState(0)

  const divEleRef = useRef<HTMLDivElement>(null)
  console.log('1')
  useEffect(() => {
    console.log('TestUseEffect_start')
    return () => {
      console.log('TestUseEffect_end')
      // clearInterval(timer)
    }
  })
  return <div ref={divEleRef}>haha {count}</div>
}