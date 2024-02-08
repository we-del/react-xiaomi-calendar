/*
 * @Author: 李云翔
 * @Date: 2024-02-06 18:01:13
 * @LastEditTime: 2024-02-08 21:06:01
 * @FilePath: \react\hook-test\src\views\MIUI_Calendar\Calendar.tsx
 * @Description: 小米ui组件实现
 * 
 */

import React, { useState } from "react";
import CalendarDetail from "./components/CalendarDetail";
import CalendarHeader from "./components/CalendarHeader";
import CalendarMain from "./components/CalendarMain";
import { ViewMode } from "./config/dayEnum";
import { TimeInfo } from "./types/types";

export const TimeInfoContext = React.createContext({})
export default function Calendar() {
  const now = new Date()
  const [timeInfo, setTimeInfoState] = useState<TimeInfo>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    yearOnView: now.getFullYear(),
    monthOnView: now.getMonth() + 1,
    dayOnView: now.getDate(),
    viewMode: ViewMode.MONTH,
  })

  return <TimeInfoContext.Provider value={timeInfo}>
    <div className=" flex-col p-4 ">
      <CalendarHeader />
      <CalendarMain />
      <CalendarDetail />
    </div>
  </TimeInfoContext.Provider>

}