import React, { useState, useRef, useEffect } from 'react';
import TestUseEffect from './views/TestUseEffect';
import TestUseRef from './views/TestUseRef';
import './App.css';
import TestUseContext from './views/TestUseContext';
import TestUseEffectExpertise from './views/TestUseEffectExpertise';
import MI_UI_Calendar from './views/MIUI_Calendar/Calendar';

export const TestContext = React.createContext(null)


function App() {
  // const [count, setCount] = useState(0)
  // setTimeout(() => {
  //   setCount(count + 1)
  // }, 1000);
  const [showTestUseEffect, setShowTestUseEffect] = useState<Boolean>(true)
  const divEleRef = useRef(null)
  const testUseRefRef = useRef(null)
  const testUseRefWrappedRef = useRef(null)

  const TestUseRefWrapped = React.forwardRef(TestUseRef)
  // useEffect(() => {
  //   console.log('divEleRef', divEleRef.current, divEleRef)
  //   console.log('testUseRefRef', testUseRefRef.current, testUseRefRef)
  //   console.log('TestUseRef__instance', testUseRefWrappedRef.current, testUseRefWrappedRef)
  //   testUseRefWrappedRef.current?.setCount(5)
  // })
  // useEffect(() => {
  //   console.log(count)
  //   return () => {
  //     console.log('count unmounted', count)
  //   }
  // })
  return (
    // <TestContext.Provider value={1}>
    <div className="App">
      {/* <button onClick={() => setShowTestUseEffect(!showTestUseEffect)}>change</button>
      {showTestUseEffect && <TestUseEffect />} */}
      {/* <TestUseRefWrapped ref={testUseRefWrappedRef} /> */}
      {/* <div ref={divEleRef}></div>
        <TestUseContext />
        <TestUseEffectExpertise /> */}
      <MI_UI_Calendar />
    </div>
    // </TestContext.Provider>

  );
}

export default App;
