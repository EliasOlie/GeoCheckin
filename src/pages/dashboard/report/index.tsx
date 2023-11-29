import BottomBar from "@/components/BottomBar/BottomBar";
import Head from "next/head";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportPage() {
  const checkins = api.dailly.getUserMonthData.useMutation();
  const loggedUser = api.user.getUser.useQuery().data;
  const user = api.user.getUserById.useMutation();
  const users = api.user.getAllUsers.useQuery().data;
  const [horasProduzidas, setHorasProduzidas] = useState<number | undefined>(0);

  useEffect(() => {
    if (loggedUser) {
      user.mutate(loggedUser.id);
      checkins.mutate(loggedUser.id);
      const totalHorasProduzidas = checkins.data?.reduce((total, checkin, index) => {
        const checkout = checkins.data?.[index + 1];
    
        if (checkin.tipo === 'CHECKIN' && checkout && checkout.tipo === 'CHECKOUT') {
          const diffMilliseconds = new Date(checkout.timestamp).getTime() - new Date(checkin.timestamp).getTime()
          return total + diffMilliseconds / 36e5;
        }
    
        return total;
      }, 0);
      setHorasProduzidas(totalHorasProduzidas)
    }
  }, [loggedUser]);

  const selectUser = (id: string) => {
    user.mutate(parseInt(id));
    checkins.mutate(parseInt(id));
    const totalHorasProduzidas = checkins.data?.reduce((total, checkin, index) => {
      const checkout = checkins.data?.[index + 1];
  
      if (checkin.tipo === 'CHECKIN' && checkout && checkout.tipo === 'CHECKOUT') {
        const diffMilliseconds = new Date(checkout.timestamp).getTime() - new Date(checkin.timestamp).getTime()
        return total + diffMilliseconds / 36e5;
      }
  
      return total;
    }, 0);
    setHorasProduzidas(totalHorasProduzidas)
  };

  return (
    <>
      <Head>
        <title>GeoCheckin | Relatório</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {loggedUser?.role === "ADM" && (
          <div className="min-w-full p-2">
            <Select onValueChange={(id) => selectUser(id)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar Usuário" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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
          {checkins?.data?.map((checkin) => (
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
                <p className="font-bold">
                  {checkin.tipo === "CHECKIN" ? "Checkin" : "Checkout"}
                </p>
              </li>
              <li
                key={checkin.id}
                className="flex w-[20vw] flex-2 items-center justify-end border-l-2  border-b-2 border-black"
              >
                <p className="font-bold">
                  {new Date(checkin.timestamp).toLocaleDateString().substring(
                    0,
                    5,
                  )}
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
          <p className="flex flex-1 border-r-2 border-black">
            Horas produzidas:
          </p>
          <p className="flex flex-1 justify-end">{horasProduzidas?.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between border-x-2 border-b-2 border-black">
          <p className="flex flex-1 border-r-2 border-black">
            Horas programadas:
          </p>
          <p className="flex flex-1 justify-end">{user?.data?.monthlyHours}</p>
        </div>
      </main>
      <BottomBar />
    </>
  );
}
