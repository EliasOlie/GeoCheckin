import BottomBar from "@/components/BottomBar/BottomBar";
import Head from "next/head";
import { api } from "@/utils/api";

export default function ReportPage() {
  const checkins = api.dailly.getMonthCheckins.useQuery().data
  const user = api.user.getUser.useQuery().data
  
  return(
    <>
      <Head>
        <title>GeoCheckin | Relatório</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="min-w-full text-center text-xl font-semibold border-2 border-black">Relatório de horas mensais</h1>
        {
          checkins?.map((checkin) => (
            
            <>
              <p key={checkin.id}>{checkin.instalationName}</p>
              <p key={checkin.id}>{new Date(checkin.timestamp).toLocaleDateString()}</p>
              <p key={checkin.id}>{new Date(checkin.timestamp).toLocaleTimeString().substring(0, 5)}</p>
            </>
          ))
        }
        <div className="flex items-center justify-between border-x-2 border-t-2 border-black">
          <p className="flex flex-1 border-r-2 border-black">Horas feitas: </p>
          <p className="flex flex-1 justify-end">0</p>
        </div>
        <div className="flex items-center justify-between border-2 border-black">
          <p className="flex flex-1 border-r-2 border-black">Horas Combinadas: </p>
          <p className="flex flex-1 justify-end">{user?.monthlyHours}</p>
        </div>

      </main>
      <BottomBar />
    </>
  )
}
