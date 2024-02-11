import { ViewMode } from "../config/dayEnum";

export type TimeInfo = {
  year?: number;
  month?: number;
  day?: number;
  yearOnView?: number;
  monthOnView?: number;
  dayOnView?: number;
  viewMode?: ViewMode
  shengXiaoForYear?: string
  selectDateDetailInfoOnView?: DayInfo
  todayDateDetailInfo?: DayInfo
}

export type TimeInfoContextType = TimeInfo & {
  setSelectedDate?: (date: DayInfo) => void
  setTimeInfoState?: (date: TimeInfo) => void
}

export type DayInfo = {
  // 数字日期
  day?: string | number;
  // 中文农历标识
  chineseDay?: string | string[]
  // 调休
  isWorkDay?: boolean
  // 法定节假日
  isRestDay?: boolean
  // 周末
  isWeekend?: boolean
  // 星期几
  weekDay?: string | number,
  // 日期全路径(yyyy-mm-dd) fullDate?: string
  fullDate?: string
  // 当前数据是否来自本月
  dateFromTheMonth?: boolean
  // 判断当前日期是否为今天(今天的字体为浅蓝色)
  isToday?: boolean
  // 判断当前日期是否被选中(如果选中的是当前字体变为白色,添加浅蓝色背景)
  isSelected?: boolean
  // 事宜
  yiList?: string[]
  // 事忌
  jiList?: string[]
  // 农历当日全名称
  chineseDateName?: string
  // 农历当年全名称
  chineseYearName?: string
  chineseMonthName?: string
  chineseDayName?: string
  // 当前日期的节日集合
  festivalList?: string[]
}
