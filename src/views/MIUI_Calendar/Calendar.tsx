/*
 * @Author: 李云翔
 * @Date: 2024-02-06 18:01:13
 * @LastEditTime: 2024-02-11 21:51:40
 * @FilePath: \react\hook-test\src\views\MIUI_Calendar\Calendar.tsx
 * @Description: 小米ui组件实现
 * 
 */

import { Lunar } from "lunar-typescript";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CalendarDetail from "./components/CalendarDetail";
import CalendarHeader from "./components/CalendarHeader";
import { ViewMode } from "./config/dayEnum";
import { getDetailDayInfo } from "./services/dateHandler";
import { DayInfo, TimeInfo } from "./types/types";

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
    shengXiaoForYear: "",
    selectDateDetailInfoOnView: {},
  })
  useEffect(() => {
    const lunar = Lunar.fromDate(new Date(timeInfo.yearOnView, 10, 1))
    const dayInfo = getDetailDayInfo(new Date(timeInfo.yearOnView, timeInfo.monthOnView - 1, timeInfo.dayOnView), timeInfo)
    setTimeInfoState({
      ...timeInfo,
      shengXiaoForYear: lunar.getYearInGanZhi() + lunar.getShengxiao() + '年',
      selectDateDetailInfoOnView: dayInfo,
      todayDateDetailInfo: dayInfo
    })
  }, [])
  const setSelectedDate = useCallback((dayInfo: DayInfo) => {
    const selectedDate = new Date(dayInfo.fullDate)
    setTimeInfoState({
      ...timeInfo,
      yearOnView: selectedDate.getFullYear(),
      monthOnView: selectedDate.getMonth() + 1,
      dayOnView: selectedDate.getDate(),
      selectDateDetailInfoOnView: dayInfo
    })
  }, [timeInfo])
  const showGoTodayBtn = useMemo(() => {
    const now = moment(`${timeInfo.year}-${timeInfo.month}-${timeInfo.day}`)
    const diffDate = moment(`${timeInfo.yearOnView}-${timeInfo.monthOnView}-${timeInfo.dayOnView}`)
    const diffDays = diffDate.diff(now, 'days')
    return diffDays !== 0 && timeInfo.viewMode === ViewMode.MONTH
  }, [timeInfo])
  return <TimeInfoContext.Provider value={{ ...timeInfo, setSelectedDate, setTimeInfoState }}>
    <div className=" flex-col p-4 w-screen h-screen">
      <CalendarHeader />
      <CalendarDetail />
      {showGoTodayBtn && <div className=" w-20 h-20 rounded-full bg-blue-500 text-white fixed bottom-8 right-8 text-2xl flex justify-center items-center" onClick={() => setSelectedDate(timeInfo.todayDateDetailInfo)}>今</div>}
    </div>
  </TimeInfoContext.Provider>

}