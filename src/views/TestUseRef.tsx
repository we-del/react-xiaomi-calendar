import { useEffect, useState, useRef, useImperativeHandle } from 'react'

export default function TestUseEffect(props, ref) {
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
  useImperativeHandle(ref, () => {
    return {
      setCount
    }
  }, [])
  return <div ref={ref}>haha {count}</div>
}