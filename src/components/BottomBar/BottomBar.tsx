import { User2Icon, CameraIcon, BarChart2Icon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomBar() {

  const pageName = usePathname()  

  return(
    <div className="fixed bottom-0 h-12  bg-violet-400 min-w-full flex justify-between items-center px-8">
      <Link href={"/dashboard/report"}>
        <BarChart2Icon className={`${pageName === "/dashboard/report"? "text-violet-700" : null}`}/>
      </Link>
      <Link href={"/dashboard"}>
        <CameraIcon className={`${pageName === "/dashboard"? "text-violet-700" : null}`}/>
      </Link>
      <Link href={"/dashboard/user"}>
        <User2Icon className={`${pageName === "/dashboard/user"? "text-violet-700" : null}`}/>
      </Link>
    </div>
  )
}