/*
 * @Author: 李云翔
 * @Date: 2024-02-04 17:26:14
 * @LastEditTime: 2024-02-04 17:59:46
 * @FilePath: \react\hook-test\src\views\TestUseEffectExpertise.tsx
 * @Description: 使用同步异步+响应状态控制完成组件mount和unmount流程的执行以及单独watch的监听
 * 
 */

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const UseEffectWrapper = forwardRef(function (props, ref) {
  const [isMounted, setIsMountedState] = useState<boolean>(false)
  console.log('props,ref', props, ref)
  useImperativeHandle(ref, () => {
    return {
      test() {
        console.log('haha');

      }
      // mounted(fn) {
      //   useEffect(() => {
      //     setIsMountedState(state => state = true)
      //     fn()
      //   }, [])
      // },
      // unmounted(fn) {
      //   useEffect(() => {
      //     return fn
      //   }, [])
      // },
      // watch(fn, relyStateList) {
      //   useEffect(() => {
      //     if (isMounted)
      //       fn()
      //   }, relyStateList)
      // }
    }
  }, [])

  return <></>
})

export default function TestUseEffectExpertise() {
  const [count, setCountState] = useState<number>(0)
  const useEffectWrapperRef = useRef<any>()
  // useEffectWrapperRef.current?.mounted(() => {
  //   console.log('mounted')
  // })
  // useEffectWrapperRef.current?.unmounted(() => {
  //   console.log('unmounted')
  // })
  // useEffectWrapperRef.current?.watch(() => {
  //   console.log('watch', count)
  // }, [count])
  setTimeout(() => {
    setCountState(count + 1)
  }, 1000);
  return <>
    <UseEffectWrapper ref={useEffectWrapperRef} ></UseEffectWrapper>
    <div>TestUseEffectExpertise {count}</div>
  </>

}
