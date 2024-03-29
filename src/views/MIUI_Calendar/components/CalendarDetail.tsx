import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { ViewMode, dayList } from "../config/dayEnum";
import { TimeInfoContext } from "../Calendar";
import type { DayInfo, TimeInfo, TimeInfoContextType } from "../types/types";
import { getDayList, getDetailDayInfo } from "../services/dateHandler";
import moment from "moment";

export default function CalendarDetail() {
  const timeInfo = useContext<TimeInfoContextType>(TimeInfoContext); // 获取日历上下文
  const [innerContextHeight, setInnerContextHeightState] = useState<number>(0)
  const [divEleTranslateX, setDivEleTranslateXState] = useState<number>(0)
  const divEleRef = useRef<HTMLDivElement>(null); // 创建一个ref来获取日历元素
  const DateDetailDivEleRef = useRef<HTMLDivElement>(null);
  // 监听页面滚动
  useEffect(() => {
    let timeOnTouchStart = 0
    let touchInfoOnTouchStart: any = {}
    let timeOnTouchEnd = 0
    const notifyTimeInfoContextUpdate = (slideDistance) => {
      if (timeInfo.viewMode == ViewMode.YEAR) {
        handleSlideForYear(slideDistance)
      } else if (timeInfo.viewMode == ViewMode.MONTH) {
        handleSlideForMonth(slideDistance)
      }
    }
    const handleSlideForYear = (slideDistance) => {
      const yearOnView = timeInfo.yearOnView + (slideDistance > 0 ? -1 : 1)
      timeInfo.setTimeInfoState({
        ...timeInfo,
        yearOnView,
        selectDateDetailInfoOnView: getDetailDayInfo(new Date(yearOnView, timeInfo.monthOnView - 1, timeInfo.dayOnView), timeInfo)
      })
    }
    const handleSlideForMonth = (slideDistance) => {
      const monthOnView = timeInfo.monthOnView + (slideDistance > 0 ? -1 : 1)
      if (monthOnView == 0) {
        timeInfo.setTimeInfoState({
          ...timeInfo,
          monthOnView: 12,
          yearOnView: timeInfo.yearOnView - 1,
          selectDateDetailInfoOnView: getDetailDayInfo(new Date(timeInfo.yearOnView - 1, 11, timeInfo.dayOnView), timeInfo)
        })
      } else if (monthOnView == 13) {
        timeInfo.setTimeInfoState({
          ...timeInfo,
          monthOnView: 1,
          yearOnView: timeInfo.yearOnView + 1,
          selectDateDetailInfoOnView: getDetailDayInfo(new Date(timeInfo.yearOnView + 1, 0, timeInfo.dayOnView), timeInfo)
        })
      } else {
        const totalDays = moment(`${timeInfo.yearOnView}-${monthOnView}`).daysInMonth()
        // 得到现在的dayOnView值,如果比最新月份的最大值大则dayOnView变为当前月份最大值
        const newState = {
          ...timeInfo,
          monthOnView,
        }
        if (totalDays < timeInfo.dayOnView) {
          newState.dayOnView = totalDays
        }
        newState.selectDateDetailInfoOnView = getDetailDayInfo(new Date(timeInfo.yearOnView, monthOnView - 1, newState.dayOnView), timeInfo)
        timeInfo.setTimeInfoState(newState)
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

    setInnerContextHeightState(DateDetailDivEleRef.current?.clientHeight)

    divEleRef.current?.addEventListener('touchstart', divEleRefTouchStartEvent, { passive: true })
    divEleRef.current?.addEventListener('touchmove', divEleRefTouchMoveEvent, { passive: true })
    divEleRef.current?.addEventListener('touchend', divEleRefTouchEndEvent, { passive: true })

    return () => {
      divEleRef.current?.removeEventListener('touchstart', divEleRefTouchStartEvent)
      divEleRef.current?.removeEventListener('touchmove', divEleRefTouchMoveEvent)
      divEleRef.current?.removeEventListener('touchstart', divEleRefTouchEndEvent)
    }
  }, [timeInfo])
  return <div className="my-2 flex-1 ">
    {(timeInfo.viewMode == ViewMode.MONTH || timeInfo.viewMode == ViewMode.WEEK) && <WeekHeader />}
    <div className=" relative " ref={divEleRef} style={{ transform: `translateX(${divEleTranslateX}px)`, height: innerContextHeight }}>
      <DateDetail dayPosition={-1} />
      <DateDetail dayPosition={0} ref={DateDetailDivEleRef} />
      <DateDetail dayPosition={1} />
    </div>
    {timeInfo.viewMode == ViewMode.MONTH && <SelectDayItemDetailInfo />}
  </div>
}

const DateDetail = forwardRef(function (props: any, ref: any) {
  const timeInfo = useContext<TimeInfoContextType>(TimeInfoContext); // 获取日历上下文
  const dayPosition = props.dayPosition;
  const dayList: DayInfo[] | DayInfo[][] = getDayList(timeInfo, dayPosition)


  const getLeftForStyle = () => {
    if (dayPosition == -1) { return '-100vw' }
    if (dayPosition == 0) { return '0' }
    if (dayPosition == 1) { return '100vw' }
  }
  if (timeInfo.viewMode == ViewMode.MONTH || timeInfo.viewMode == ViewMode.WEEK) {
    return <div className=" w-full grid grid-cols-7 gap-2 my-4 absolute" style={{ left: getLeftForStyle() }} ref={ref}>
      {
        dayList.map((dayInfo, i) => <DayItem dayInfo={dayInfo} key={i} />)
      }
    </div>
  }

  if (timeInfo.viewMode == ViewMode.YEAR) {
    return <div className=" w-full grid grid-cols-3 gap-4 my-4 absolute" style={{ left: getLeftForStyle() }} >
      {
        dayList.map((dayInfo, i) => <MonthItem dayInfo={dayInfo as DayInfo[]} month={i + 1} key={i} />)
      }
    </div>
  }
  return <></>
})
function WeekHeader() {
  const { viewMode } = useContext<TimeInfoContextType>(TimeInfoContext)
  return <div className="grid grid-cols-7 gap-2 ">
    {dayList.map(weekName => <div style={viewMode == ViewMode.YEAR ? { fontSize: '.45rem' } : { fontSize: '.7rem' }}>{weekName}</div>)}
  </div>
}
function MonthItem({ dayInfo, month }: { dayInfo: DayInfo[], month: number }) {
  const todayInMonth = dayInfo.find(day => day.isToday)
  const timeInfo = useContext<TimeInfoContextType>(TimeInfoContext)
  const setViewForDate = () => {
    const totalDays = moment(`${timeInfo.yearOnView}-${month}`).daysInMonth()
    // 得到现在的dayOnView值,如果比最新月份的最大值大则dayOnView变为当前月份最大值
    const newState = {
      ...timeInfo,
      monthOnView: month,
      viewMode: ViewMode.MONTH,
    }
    if (totalDays < timeInfo.dayOnView) {
      newState.dayOnView = totalDays
    }
    newState.selectDateDetailInfoOnView = getDetailDayInfo(new Date(timeInfo.yearOnView, newState.monthOnView - 1, newState.dayOnView), timeInfo)
    timeInfo.setTimeInfoState(newState)
  }
  return <div className=" flex-col " onClick={setViewForDate}>
    <div className=" text-lg font-bold " style={todayInMonth && { color: "rgb(59, 130, 246)" }}>{month}月</div>
    <WeekHeader />
    <div className="w-full grid grid-cols-7 gap-1">
      {dayInfo.map((info, i) => <DayItem dayInfo={info} key={i} />)}
    </div>
  </div>
}



function DayItem({ dayInfo }: { dayInfo: DayInfo }) {
  const { viewMode } = useContext<TimeInfoContextType>(TimeInfoContext); // 获取日历上下文
  if (viewMode == ViewMode.MONTH) {
    return <DayItemForMonth dayInfo={dayInfo} />
  }
  if (viewMode == ViewMode.YEAR) {
    return <DayItemForYear dayInfo={dayInfo} />
  }
  return <></>
}

function DayItemForMonth({ dayInfo }: { dayInfo: DayInfo }) {
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
  return <div className={dayStyles} onClick={() => setSelectedDate(dayInfo)}>
    {isHoliday && <div style={{ fontSize: 10, color: getHolidayColor() }} className=" absolute right-0 -top-1">{dayInfo.isWorkDay ? '班' : dayInfo.isRestDay ? '休' : ''}</div>}
    <div style={{ fontSize: 14 }}>{dayInfo.day}</div>
    <div style={{ fontSize: 11 }}>{dayInfo.chineseDay}</div>
  </div>
}

function DayItemForYear({ dayInfo }: { dayInfo: DayInfo }) {

  const isRest = dayInfo.isRestDay || dayInfo.isWeekend
  let dayStyles = ""
  if (isRest) {
    dayStyles = " text-gray-200"
  }
  if (dayInfo.isToday) {
    dayStyles = " text-white rounded bg-blue-500 "
  }
  return <>
    <div className={dayStyles} style={{ fontSize: '.5rem' }}>{dayInfo.day}</div>
  </>
}

function SelectDayItemDetailInfo() {
  const { selectDateDetailInfoOnView } = useContext<TimeInfoContextType>(TimeInfoContext)
  const { isRestDay, isWorkDay, chineseDateName, chineseYearName, chineseMonthName, chineseDayName, yiList, jiList } = selectDateDetailInfoOnView
  // 展示休假或调休符号
  const showFestivalSign = isRestDay || isWorkDay
  return <div className=" rounded bg-gray-200 p-2 mt-20 text-left">
    <div className=" text-md font-bold">{chineseDateName}</div>
    <div className=" my-2" style={{ fontSize: 12 }}>
      {showFestivalSign && <span>
        <span className={isRestDay ? 'text-blue-400' : 'text-red-500'}>
          {isRestDay ? "休" : "班"}
        </span>
        <i className="mx-1">|</i></span>}
      <span>{chineseYearName} {chineseMonthName} {chineseDayName}</span>
    </div>
    <div className=" grid grid-cols-2 gap-2" style={{ fontSize: 11 }}>
      <div className=" overflow-hidden text-ellipsis ">
        <span className=" p-1 m-1 rounded text-white bg-orange-300">宜</span>
        {
          yiList?.map((item, index) => <span key={index} className=" "> {item} </span>)
        }
      </div>
      <div className=" overflow-hidden text-ellipsis ">
        <span className=" p-1 m-1 rounded text-white bg-gray-700">忌</span>
        {
          jiList?.map((item, index) => <span key={index} className=" "> {item} </span>)
        }

      </div>
    </div>
  </div>
}



