import BottomBar from "@/components/BottomBar/BottomBar";
import Head from "next/head";
import { api } from "@/utils/api";

export default function ReportPage() {
  const checkins = api.dailly.getMonthCheckins.useQuery().data;
  const user = api.user.getUser.useQuery().data;

  return (
    <>
      <Head>
        <title>GeoCheckin | Relatório</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="min-w-full text-center text-xl font-semibold border-2 border-black">
          Relatório de horas mensais
        </h1>
        <ul className="flex flex-col">
          <div className="flex min-w-full">
            <li className="flex w-[40vw] items-center justify-center border-l-2 border-b-2 border-black">
              <p className="font-bold">Local</p>
            </li>
            <li className="flex w-[20vw] items-center justify-center border-l-2  border-b-2 border-black">
              <p className="font-bold">Tipo</p>
            </li>
            <li className="flex w-[20vw] items-center justify-center border-l-2  border-b-2 border-black">
              <p className="font-bold">Data</p>
            </li>
            <li className="flex w-[20vw] items-center justify-center border-x-2  border-b-2 border-black">
              <p className="font-bold">Hora</p>
            </li>
          </div>
          {checkins?.map((checkin) => (
            <div key={undefined} className="flex">
              <li
                key={checkin.id}
                className="flex w-[40vw] flex-1 items-center border-l-2  border-b-2 border-black"
              >
                <p className="font-bold">{checkin.instalationName}</p>
              </li>
              <li
                key={checkin.id}
                className="flex w-[20vw] flex-2 items-center border-l-2  border-b-2 border-black"
              >
                <p className="font-bold">Checkin</p>
              </li>
              <li
                key={checkin.id}
                className="flex w-[20vw] flex-2 items-center justify-end border-l-2  border-b-2 border-black"
              >
                <p className="font-bold">
                  {new Date(checkin.timestamp).toLocaleDateString().substring(0, 5)}
                </p>
              </li>
              <li
                key={checkin.id}
                className="flex w-[20vw] flex-2 items-center justify-end border-x-2  border-b-2 border-black"
              >
                <p className="font-bold">
                  {new Date(checkin.timestamp).toLocaleTimeString().substring(
                    0,
                    5,
                  )}
                </p>
              </li>
            </div>
          ))}
        </ul>

        <div className="flex items-center justify-between border-b-2 border-x-2 border-black">
          <p className="flex flex-1 border-r-2 border-black">Horas feitas:</p>
          <p className="flex flex-1 justify-end">0</p>
        </div>
        <div className="flex items-center justify-between border-x-2 border-b-2 border-black">
          <p className="flex flex-1 border-r-2 border-black">
            Horas Combinadas:
          </p>
          <p className="flex flex-1 justify-end">{user?.monthlyHours}</p>
        </div>
      </main>
      <BottomBar />
    </>
  );
}
