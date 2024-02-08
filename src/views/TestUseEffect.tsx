import { useEffect, useState } from 'react'

export default function TestUseEffect() {
  const [count, setCount] = useState(0)
  // useEffect 
  // 1. useEffect在没有传入第二个参数,即依赖数组时,默认被所有的该组件内的所有状态收集,当这些状态发生改变时,useEffect会被调用,并完成重新渲染(会重新执行一次组件的remount行为?)
  // 2. 不要在组件内使用定时器,因为每次状态改变后都会重新remount执行组件实例,这样定时器也会被执行反复执行(如果必须在组件内使用,需要在return位置抛出一个函数关闭定时器,相同于unmounted钩子函数)
  // const timer = setInterval(() => {
  //   setCount(count + 1)
  // }, 1000)

  setTimeout(() => {
    setCount(count + 1)
  }, 1000);
  // 领悟版本
  // useEffect是一个副作用函数
  // 本职使命是监听组件的mount和unmount的流程
  // 但有一个依赖列表可以让useEffect完成额外的工作,如监听某个属性的beforeUpdate(函数体)和updated阶段(返回的函数体)
  // 当没有传入依赖列表时,useEffect监听了组件的unmount,mount,beforeUpdated和updated流程
  // 当传入一个空数组时,只会监听组件的unmount和mount流程
  // 在传入几个有限的响应属性时则监听的是组件的unmount和mount流程,和经由这些响应属性变化完成的beforeUpdated和updated流程

  // 研究useEffect的意外之喜
  // 当组件实例的响应状态改变后,他会通知对应组件实例完成一个组件的updated流程
 

  console.log('1')
  useEffect(() => {
    console.log('TestUseEffect_start')
    return () => {
      console.log('TestUseEffect_end')
      // clearInterval(timer)
    }
  })
  return <div>haha {count}</div>
}