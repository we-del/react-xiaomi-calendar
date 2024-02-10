import { useCallback, useContext, useEffect, useMemo } from "react"
import { TimeInfoContext } from "../Calendar"
import { TimeInfo, TimeInfoContextType } from "../types/types"
import moment from "moment"
import { ViewMode } from "../config/dayEnum"
import { Lunar } from "lunar-typescript"

export default function CalendarHeader() {
  const timeInfo = useContext<TimeInfoContextType>(TimeInfoContext)
  const disTanceDayInfo = useMemo(() => {
    const now = moment(`${timeInfo.year}-${timeInfo.month}-${timeInfo.day}`)
    const diffDate = moment(`${timeInfo.yearOnView}-${timeInfo.monthOnView}-${timeInfo.dayOnView}`)
    const diffDays = diffDate.diff(now, 'days')
    return {
      day: Math.abs(diffDays),
      distanceChinese: diffDays > 0 ? '后' : '前',
      show: diffDays !== 0
    }
  }, [timeInfo])

  const toggleDateMode = () => {
    timeInfo.setTimeInfoState({
      ...timeInfo,
      viewMode: ViewMode.YEAR,
    })
  }
  useEffect(() => {
    const activeDate = Lunar.fromDate(new Date(timeInfo.yearOnView + "-12-25"))
    timeInfo.setTimeInfoState({
      ...timeInfo,
      shengXiaoForYear: activeDate.getYearInGanZhi() + activeDate.getShengxiao() + '年',
    })
  }, [timeInfo.yearOnView])
  return <div className=" flex justify-between ">
    {
      timeInfo.viewMode === ViewMode.MONTH &&
      <div className=" relative top-7 mb-7" onClick={() => toggleDateMode()}>
        <span className=" text-4xl">
          {timeInfo.yearOnView}/{timeInfo.monthOnView}
        </span>
        {disTanceDayInfo.show && <span>
          {disTanceDayInfo.day}天{disTanceDayInfo.distanceChinese}
        </span>}
      </div>
    }
    {
      timeInfo.viewMode === ViewMode.YEAR &&
      <div>
        {timeInfo.yearOnView}
        <span className=" ml-2 text-red-400" style={{ fontSize: 10 }}>{timeInfo.shengXiaoForYear}</span>
      </div>
    }
    <div className="flex ">
      <div className="mx-2">+</div>
      <div className="mx-2">C</div>
      <div className="mx-2">M</div>
    </div>
  </div>
}