import { useEffect, useState, useRef, useImperativeHandle, useContext } from 'react'
import { TestContext } from '../App'

export default function TestUseContext(props) {
  const [count, setCount] = useState(0)
  const testContext = useContext(TestContext)
  const divEleRef = useRef<HTMLDivElement>(null)
  console.log('test-use-context')
  return <div >{testContext}</div>
}