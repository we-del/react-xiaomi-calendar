import { useContext, useMemo } from "react"

import { TimeInfoContext } from "../Calendar"
import { TimeInfo } from "../types/types"
import moment from "moment"

export default function CalendarHeader() {
  const timeInfo = useContext<TimeInfo>(TimeInfoContext)
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
  return <div className=" flex justify-between ">
    <div className=" relative top-7 mb-7">
      <span className=" text-4xl">
        {timeInfo.yearOnView}/{timeInfo.monthOnView}
      </span>
      {disTanceDayInfo.show && <span>
        {disTanceDayInfo.day}天{disTanceDayInfo.distanceChinese}
      </span>}
    </div>
    <div className="flex ">
      <div className="mx-2">+</div>
      <div className="mx-2">C</div>
      <div className="mx-2">M</div>
    </div>
  </div>
}