import { useContext, useMemo } from "react";
import { ViewMode, dayList } from "../config/dayEnum";
import { TimeInfoContext } from "../Calendar";
import type { DayInfo, TimeInfo } from "../types/types";
import { getDayList } from "../services/dateHandler";

export default function CalendarDetail() {
  const timeInfo = useContext<TimeInfo>(TimeInfoContext); // 获取日历上下文
  return <div className="my-2 ">
    {(timeInfo.viewMode == ViewMode.MONTH || timeInfo.viewMode == ViewMode.WEEK) && <WeekHeader />}
    <DayDetail />
  </div>
}

function DayDetail() {
  const timeInfo = useContext<TimeInfo>(TimeInfoContext); // 获取日历上下文
  const dayList: DayInfo[] = getDayList(timeInfo)
  if (timeInfo.viewMode == ViewMode.MONTH || timeInfo.viewMode == ViewMode.WEEK) {
    return <div className="grid grid-cols-7 gap-2 my-4">
      {
        dayList.map(dayInfo => <DayItem dayInfo={dayInfo} />)
      }
    </div>
  }
  return <></>
}

function DayItem({ dayInfo }: { dayInfo: DayInfo }) {
  let dayStyles = "flex-col justify-center items-center text-sm"
  if (dayInfo.isWorkDay) {
    dayStyles += " bg-gray-100 rounded relative"
  } else if (dayInfo.isRestDay) {
    dayStyles += " bg-blue-200 rounded relative"
  } else if (dayInfo.isWeekend || !dayInfo.dateFromTheMonth) {
    dayStyles += " text-gray-400"
  }
  const isHoliday = dayInfo.isWorkDay || dayInfo.isRestDay
  const getHolidayColor = () => {
    if (dayInfo.isRestDay)
      return '#3194e8'
    if (dayInfo.isWorkDay)
      return '#c0443e'
  }

  return <div className={dayStyles}>
    {isHoliday && <div style={{ fontSize: 10, color: getHolidayColor() }} className=" absolute right-1 -top-1">{dayInfo.isWorkDay ? '班' : dayInfo.isRestDay ? '休' : ''}</div>}
    <div style={{ fontSize: 14 }}>{dayInfo.day}</div>
    <div style={{ fontSize: 10 }}>{dayInfo.chineseDay}</div>
  </div>
}


function WeekHeader() {
  return <div className="grid grid-cols-7 gap-2 ">
    {dayList.map(weekName => <div className=" text-xs">{weekName}</div>)}
  </div>
}



