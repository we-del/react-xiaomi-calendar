import moment from "moment";
import { DayInfo, TimeInfo } from "../types/types";
import { ViewMode } from "../config/dayEnum";
import { Lunar, Solar, HolidayUtil } from 'lunar-typescript'
export function getDayList(timeInfo: TimeInfo): DayInfo[] {
  if (timeInfo.viewMode == ViewMode.YEAR) {
    return getYearList(timeInfo);
  } else if (timeInfo.viewMode == ViewMode.MONTH) {
    return getMonthList(timeInfo);
  } else if (timeInfo.viewMode == ViewMode.WEEK) {
    return getWeekList(timeInfo);
  }
  return []
}

function getYearList(timeInfo: TimeInfo): DayInfo[] {
  return
}

function getMonthList(timeInfo: TimeInfo): DayInfo[] {
  const { yearOnView, dayOnView, monthOnView } = timeInfo;
  const curDate = moment(`${yearOnView}-${monthOnView}`)
  const daysOnCurMonth = curDate.daysInMonth();
  const startDayOnCurMonth = parseInt(curDate.startOf('month').format('d'))
  let dayList = []
  let i = 0
  for (i = 0; i < daysOnCurMonth + startDayOnCurMonth; i++) {
    if (!dayList.length || dayList[dayList.length - 1]) {
      dayList = dayList.concat(new Array(7).fill(null))
    }
    const day = i - startDayOnCurMonth + 1
    if (i < startDayOnCurMonth) {
      dayList[i] = getDetailDayInfo(new Date(yearOnView, monthOnView - 1, day), timeInfo)

      continue;
    }
    dayList[i] = getDetailDayInfo(new Date(yearOnView, monthOnView - 1, day), timeInfo)
  }
  let index = dayList.findIndex(dayInfo => !dayInfo)
  if (index !== -1) {
    for (index; index < dayList.length; index++) {
      const day = index - startDayOnCurMonth + 1
      dayList[index] = getDetailDayInfo(new Date(yearOnView, monthOnView - 1, day), timeInfo)
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
function getDetailDayInfo(date: Date, timeInfo: TimeInfo): DayInfo {
  const lunar = Lunar.fromDate(date)
  const dateForMoment = moment(date)
  const weekDay = dateForMoment.format('dddd')
  const a = date.getMonth()
  const dayInfo: DayInfo = {
    day: Solar.fromDate(date).getDay(),
    chineseDay: lunar.getDayInChinese(),
    isWeekend: weekDay == "Saturday" || weekDay == "Sunday",
    weekDay,
    fullDate: dateForMoment.format('YYYY-MM-DD'),
    dateFromTheMonth: date.getMonth() + 1 == timeInfo.monthOnView,
  }

  // 用于区分法定节假日和调休
  const holiday = HolidayUtil.getHoliday(dateForMoment.format('YYYY-MM-DD'))
  if (holiday) {
    dayInfo.isRestDay = !holiday.isWork()
    dayInfo.isWorkDay = holiday.isWork()
  }
  const season = lunar.getJieQi()
  const festivals = lunar.getFestivals()
  /**
   * 中文名规则,如果当前包含节气,月初,法定节价值的,优先响应
   */
  if (season) {
    dayInfo.chineseDay = season
  } else if (lunar.getDay() == 1) {
    dayInfo.chineseDay = lunar.getMonthInChinese() + '月'
  } else if (festivals.length) {
    dayInfo.chineseDay = festivals[0]
  }
  return dayInfo
}