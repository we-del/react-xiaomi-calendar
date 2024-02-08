import { useContext, useMemo } from "react"

import { TimeInfoContext } from "../Calendar"
import { TimeInfo } from "../types/types"

export default function CalendarHeader() {
  const timeInfo = useContext<TimeInfo>(TimeInfoContext)
  const disTanceDayInfo = useMemo(() => {
    return {
      day: Math.abs(timeInfo.day),
      distanceChinese: timeInfo.day > 0 ? '后' : '前',
      show: timeInfo.day !== 0
    }
  }, [timeInfo.day])
  const year = useMemo(() => {
    return timeInfo.year
  }, [timeInfo.year])
  const month = useMemo(() => {
    return timeInfo.month 
  }, [timeInfo.month])
  return <div className=" flex justify-between ">
    <div className=" relative top-7 mb-7">
      <span className=" text-4xl">
        {year}/{month}
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