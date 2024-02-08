import { ViewMode } from "../config/dayEnum";

export type TimeInfo = {
  year?: number;
  month?: number;
  day?: number;
  yearOnView?: number;
  monthOnView?: number;
  dayOnView?: number;
  viewMode?: ViewMode
}

export type DayInfo = {
  // 数字日期
  day?: string | number;
  // 中文农历标识
  chineseDay?: string
  // 调休
  isWorkDay?: boolean
  // 法定节假日
  isRestDay?: boolean
  // 周末
  isWeekend?: boolean
  // 星期几
  weekDay?: string | number,
  // 日期全路径
  fullDate?: string
  // 当前数据是否来自本月
  dateFromTheMonth?: boolean
}