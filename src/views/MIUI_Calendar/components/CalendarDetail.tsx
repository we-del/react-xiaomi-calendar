import { useContext, useEffect, useRef, useState } from "react";
import { ViewMode, dayList } from "../config/dayEnum";
import { TimeInfoContext } from "../Calendar";
import type { DayInfo, TimeInfo, TimeInfoContextType } from "../types/types";
import { getDayList } from "../services/dateHandler";

export default function CalendarDetail() {
  const timeInfo = useContext<TimeInfoContextType>(TimeInfoContext); // 获取日历上下文
  const [divEleTranslateX, setDivEleTranslateXState] = useState<number>(0)
  const divEleRef = useRef<HTMLDivElement>(null); // 创建一个ref来获取日历元素

  // 监听页面滚动
  useEffect(() => {
    let timeOnTouchStart = 0
    let touchInfoOnTouchStart: any = {}
    let timeOnTouchEnd = 0
    const notifyTimeInfoContextUpdate = (slideDistance) => {
      const monthOnView = timeInfo.monthOnView + (slideDistance > 0 ? -1 : 1)
      if (monthOnView == 0) {
        timeInfo.setTimeInfoState({
          ...timeInfo,
          monthOnView: 12,
          yearOnView: timeInfo.yearOnView - 1
        })
      } else if (monthOnView == 13) {
        timeInfo.setTimeInfoState({
          ...timeInfo,
          monthOnView: 1,
          yearOnView: timeInfo.yearOnView + 1
        })
      } else {
        timeInfo.setTimeInfoState({
          ...timeInfo,
          monthOnView
        })
      }
    }

    const initCacheTouchParams = () => {
      timeOnTouchStart = 0
      touchInfoOnTouchStart = {}
      timeOnTouchEnd = 0
    }
    const divEleRefTouchStartEvent = (e: TouchEvent) => {

      touchInfoOnTouchStart = e.changedTouches[0]
      timeOnTouchStart = e.timeStamp
    }
    const divEleRefTouchMoveEvent = (e: TouchEvent) => {
      const touchInfo = e.changedTouches[0]
      const xOffset = touchInfo.pageX - touchInfoOnTouchStart.pageX
      setDivEleTranslateXState(xOffset)
    }
    const divEleRefTouchEndEvent = (e: TouchEvent) => {
      // 处理是否进行滚动操作(如果小于1s的滑动则进行日历切换,否则只有超过了屏幕的一半的距离时我才进行对应的滚动)
      timeOnTouchEnd = e.timeStamp
      const touchInfo = e.changedTouches[0]
      // 如果是正值,说明需要回到上一个月份,否则反之
      const slideDistance = touchInfo.pageX - touchInfoOnTouchStart.pageX

      // 碰到闭包引用导致状态无法正常更新问题,解决方法一:依赖对应的响应数据,使当前timeInfo指向永远为最新,解决方法二:使用函数设置方式,永远获取最新的响应数据
      if (timeOnTouchEnd - timeOnTouchStart < 500 && Math.abs(slideDistance) > 20) {
        notifyTimeInfoContextUpdate(slideDistance)
      } else if (Math.abs(slideDistance) > window.innerWidth / 2) {
        notifyTimeInfoContextUpdate(slideDistance)
      }
      // 还原初始状态
      setDivEleTranslateXState(0)
      initCacheTouchParams()
    }

    divEleRef.current?.addEventListener('touchstart', divEleRefTouchStartEvent)
    divEleRef.current?.addEventListener('touchmove', divEleRefTouchMoveEvent)
    divEleRef.current?.addEventListener('touchend', divEleRefTouchEndEvent)

    return () => {
      divEleRef.current?.removeEventListener('touchstart', divEleRefTouchStartEvent)
      divEleRef.current?.removeEventListener('touchmove', divEleRefTouchMoveEvent)
      divEleRef.current?.removeEventListener('touchstart', divEleRefTouchEndEvent)
    }
  }, [timeInfo])
  return <div className="my-2 ">
    {(timeInfo.viewMode == ViewMode.MONTH || timeInfo.viewMode == ViewMode.WEEK) && <WeekHeader />}
    <div className=" relative transition" ref={divEleRef} style={{ transform: `translateX(${divEleTranslateX}px)` }}>

      <DayDetail dayPosition={-1} />
      <DayDetail dayPosition={0} />
      <DayDetail dayPosition={1} />
    </div>

  </div>
}

function DayDetail(props) {
  const timeInfo = useContext<TimeInfo>(TimeInfoContext); // 获取日历上下文
  const dayPosition = props.dayPosition;
  const dayList: DayInfo[] = getDayList(timeInfo, dayPosition)
  const getLeftForStyle = () => {
    if (dayPosition == -1) { return '-100vw' }
    if (dayPosition == 0) { return '0' }
    if (dayPosition == 1) { return '100vw' }
  }
  if (timeInfo.viewMode == ViewMode.MONTH || timeInfo.viewMode == ViewMode.WEEK) {
    return <div className=" w-full grid grid-cols-7 gap-2 my-4 absolute" style={{ left: getLeftForStyle() }}>
      {
        dayList.map(dayInfo => <DayItem dayInfo={dayInfo} />)
      }
    </div>
  }
  return <></>
}

function DayItem({ dayInfo }: { dayInfo: DayInfo }) {
  const { setSelectedDate } = useContext<TimeInfoContextType>(TimeInfoContext); // 获取日历上下文
  let dayStyles = "flex-col justify-center items-center text-sm border border-transparent rounded solid"
  if (dayInfo.isWorkDay) {
    dayStyles += " bg-gray-100  relative"
  } else if (dayInfo.isRestDay) {
    dayStyles += " bg-blue-200  relative"
  } else if (dayInfo.isWeekend || !dayInfo.dateFromTheMonth) {
    dayStyles += " text-gray-400"
  }

  if (dayInfo.isToday) {
    dayStyles += dayInfo.isSelected ? " text-white  bg-blue-400" : " text-blue-400"
  } else if (dayInfo.isSelected) {
    // 透明背景的优先级太高,需要手动把选中的日期剔除掉
    const styleList = dayStyles.split(' ')
    const index = styleList.findIndex(className => className == 'border-transparent')
    styleList.splice(index, 1)
    dayStyles = styleList.join(' ')
    dayStyles += " border-blue-400  bg-white"
  }
  const isHoliday = dayInfo.isWorkDay || dayInfo.isRestDay
  const getHolidayColor = () => {
    if (dayInfo.isRestDay)
      return '#3194e8'
    if (dayInfo.isWorkDay)
      return '#c0443e'
  }

  return <div className={dayStyles} onClick={(e) => {
    setSelectedDate(dayInfo)
  }}>
    {isHoliday && <div style={{ fontSize: 10, color: getHolidayColor() }} className=" absolute right-0 -top-1">{dayInfo.isWorkDay ? '班' : dayInfo.isRestDay ? '休' : ''}</div>}
    <div style={{ fontSize: 14 }}>{dayInfo.day}</div>
    <div style={{ fontSize: 10 }}>{dayInfo.chineseDay}</div>
  </div>
}


function WeekHeader() {
  return <div className="grid grid-cols-7 gap-2 ">
    {dayList.map(weekName => <div className=" text-xs">{weekName}</div>)}
  </div>
}



