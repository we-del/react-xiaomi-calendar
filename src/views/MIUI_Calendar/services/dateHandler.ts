import moment from "moment";
import { DayInfo, TimeInfo } from "../types/types";
import { ViewMode } from "../config/dayEnum";
import { Lunar, Solar, HolidayUtil } from 'lunar-typescript'
export function getDayList(timeInfo: TimeInfo, dayPosition: number): DayInfo[] | DayInfo[][] {
  if (timeInfo.viewMode == ViewMode.YEAR) {
    return getYearList(timeInfo, dayPosition);
  } else if (timeInfo.viewMode == ViewMode.MONTH) {
    return getMonthList(timeInfo, dayPosition);
  } else if (timeInfo.viewMode == ViewMode.WEEK) {
    return getWeekList(timeInfo);
  }
  return []
}

function getYearList(timeInfo: TimeInfo, dayPosition: number): DayInfo[][] {
  const dayInfoList = []
  for (let i = 1; i <= 12; i++) {
    const dayList = getMonthList({
      ...timeInfo,
      monthOnView: i
    }, dayPosition).map(day => day.dateFromTheMonth ? day : {})

    dayInfoList.push(dayList)
  }
  return dayInfoList
}

function buildDetailDayInfoParams(timeInfo: TimeInfo & { offset: number, timeInfo: TimeInfo }) {
  const { year, offset, day, month } = timeInfo;
  if (timeInfo.viewMode == ViewMode.YEAR) {
    return new Date(
      year + offset, month, day)
  }
  if (timeInfo.viewMode == ViewMode.MONTH) {
    return new Date(
      year, month + offset, day)
  }
}

function getMonthList(timeInfo: TimeInfo, dayPosition: number): DayInfo[] {
  const { yearOnView, viewMode, monthOnView } = timeInfo;
  let curDate = null
  if (viewMode == ViewMode.YEAR) {
    curDate = moment(`${yearOnView + dayPosition}-${monthOnView} `)
  }
  if (viewMode == ViewMode.MONTH) {
    curDate = moment(`${yearOnView}-${monthOnView + dayPosition} `)
  }

  if (viewMode == ViewMode.MONTH) {
    if (monthOnView + dayPosition == 0) {
      curDate = moment(`${yearOnView - 1}-${12} `)
    } else if (monthOnView + dayPosition == 13) {
      curDate = moment(`${yearOnView + 1}-${1} `)
    }
  }
  const daysOnCurMonth = curDate.daysInMonth();
  const startDayOnCurMonth = parseInt(curDate.startOf('month').format('d'))
  let dayList = []
  let i = 0
  for (i = 0; i < daysOnCurMonth + startDayOnCurMonth; i++) {
    if (!dayList.length || dayList[dayList.length - 1]) {
      dayList = dayList.concat(new Array(7).fill(null))
    }
    const day = i - startDayOnCurMonth + 1

    dayList[i] = getDetailDayInfo(
      buildDetailDayInfoParams({
        year: yearOnView,
        month: monthOnView - 1,
        day,
        offset: dayPosition,
        viewMode: timeInfo.viewMode,
        timeInfo,
      })
      , timeInfo)
  }
  let index = dayList.findIndex(dayInfo => !dayInfo)
  if (index !== -1) {
    for (index; index < dayList.length; index++) {
      const day = index - startDayOnCurMonth + 1
      dayList[index] = getDetailDayInfo(
        buildDetailDayInfoParams({
          year: yearOnView,
          month: monthOnView - 1,
          day,
          offset: dayPosition,
          viewMode: timeInfo.viewMode,
          timeInfo,
        })
        , timeInfo)
    }
  }
  return dayList
}

function getWeekList(timeInfo: TimeInfo): DayInfo[] {
  return []
}

/**
 * @description: 用于组装日历详细信息,包含对应日期和节气
 * @param {Date} date
 * @return {*}
 */
export function getDetailDayInfo(date: Date, timeInfo: TimeInfo): DayInfo {
  const lunar = Lunar.fromDate(date)
  const solar = Solar.fromDate(date)
  const dateForMoment = moment(date)
  const weekDay = dateForMoment.format('dddd')
  const { year, month, day, yearOnView, monthOnView, dayOnView } = timeInfo
  const dayInfo: DayInfo = {
    day: Solar.fromDate(date).getDay(),
    chineseDay: lunar.getDayInChinese(),
    isWeekend: weekDay == "Saturday" || weekDay == "Sunday",
    weekDay,
    fullDate: dateForMoment.format('YYYY-MM-DD'),
    dateFromTheMonth: date.getMonth() + 1 == timeInfo.monthOnView,
    isToday: dateForMoment.isSame(moment(`${year}-${month}-${day}`), 'day'),
    isSelected: dateForMoment.isSame(moment(`${yearOnView}-${monthOnView}-${dayOnView}`), 'day'),
    yiList: lunar.getDayYi(),
    jiList: lunar.getDayJi(),
    chineseDateName: '农历' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese(),
    chineseYearName: lunar.getYearInGanZhi() + lunar.getShengxiao() + '年',
    chineseMonthName: lunar.getMonthInGanZhi() + '月',
    chineseDayName: lunar.getDayInGanZhi() + '日',
  }

  if (dayInfo.chineseDateName.includes('腊月廿三')) {
    dayInfo.chineseDay = '北方小年'
  } else if (dayInfo.chineseDateName.includes('腊月廿四')) {
    dayInfo.chineseDay = '南方小年'
  }
  // 用于区分法定节假日和调休
  const holiday = HolidayUtil.getHoliday(dateForMoment.format('YYYY-MM-DD'))
  if (holiday) {
    dayInfo.isRestDay = !holiday.isWork()
    dayInfo.isWorkDay = holiday.isWork()
  }
  const season = lunar.getJieQi()
  const festivalList = []
  const festivalsForLunar = lunar.getFestivals()
  const festivalsForSolar = solar.getFestivals()
  festivalList.push(...festivalsForSolar, ...festivalsForLunar)
  dayInfo.festivalList = festivalList
  /**
   * 中文名规则,如果当前包含节气,月初,法定节价值的,优先响应
   */
  if (festivalList.length && festivalList[0].length < 4) {
    dayInfo.chineseDay = festivalList[0]
  } else if (season) {
    dayInfo.chineseDay = season
  } else if (lunar.getDay() == 1) {
    dayInfo.chineseDay = lunar.getMonthInChinese() + '月'
  }
  return dayInfo
}