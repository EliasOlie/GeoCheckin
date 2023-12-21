/* eslint-disable react-hooks/exhaustive-deps */
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
import { Input } from "@/components/ui/input";
import type { Checkin } from "@prisma/client";

import { Trash2Icon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CreateCheckinDialog from "@/components/Dialogs/CreateCheckin";

export default function ReportPage() {
  const { toast } = useToast();
  const checkins = api.dailly.getUserMonthData.useMutation({
    onSuccess(data) {
      calcularHorasProduzidas(data);
    },
  });
  const deleteCheckin = api.dailly.deleteCheckin.useMutation({
    onSuccess() {
      toast({
        title: "Checkin deletado com sucesso!",
      });
      checkins.mutate({ userId: selectedUserId });
    },
    onError: () => {
      toast({
        title: "Ops parece que algo deu errado",
        description: "Se persistir chame a assistência",
        variant: "destructive",
      });
    },
  });
  const loggedUser = api.user.getUser.useQuery().data;
  const user = api.user.getUserById.useMutation();
  const users = api.user.getAllUsers.useQuery().data;
  const [horasProduzidas, setHorasProduzidas] = useState<number | undefined>(0);
  const [data, setData] = useState<Date>(new Date());
  const [selectedUserId, setSelectedUserId] = useState<number>(0);

  const calcularHorasProduzidas = (data: Checkin[]) => {
    const totalHorasProduzidas = data.reduce((total, checkin, index) => {
      const checkout = data[index + 1];

      if (
        checkin.tipo === "CHECKIN" &&
        checkout &&
        checkout.tipo === "CHECKOUT"
      ) {
        const diffMilliseconds =
          new Date(checkout.timestamp).getTime() -
          new Date(checkin.timestamp).getTime();
        return total + diffMilliseconds / 36e5;
      }

      return total;
    }, 0);
    setHorasProduzidas(totalHorasProduzidas);
  };

  useEffect(() => {
    if (loggedUser) {
      user.mutate(loggedUser.id);
      setSelectedUserId(loggedUser.id);
      checkins.mutate({ userId: loggedUser.id });
    }
  }, [loggedUser]);

  const selectUser = (id: string) => {
    user.mutate(parseInt(id));
    setSelectedUserId(parseInt(id));
    checkins.mutate({ userId: parseInt(id) });
  };

  const selectData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((_) => {
      if (loggedUser && loggedUser?.role !== "ADM") {
        checkins.mutate({
          userId: loggedUser.id,
          date: new Date(e.target.value.replace(/-/g, "/")),
        });
      } else {
        checkins.mutate({
          userId: selectedUserId,
          date: new Date(e.target.value.replace(/-/g, "/")),
        });
      }
      return new Date(e.target.value.replace(/-/g, "/"));
    });
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
          <div className="flex min-w-full gap-2 p-2">
            <Select
              onValueChange={(id) => selectUser(id)}
              defaultValue={loggedUser.id.toString()}
            >
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
            <Input
              value={data.toISOString().substring(0, 10)}
              type="date"
              onChange={selectData}
            />
          </div>
        )}
        {loggedUser?.role === "ADM" && (
          <div className="flex min-w-full gap-2 p-2">
            <CreateCheckinDialog />
          </div>
        )}
        <h1 className="min-w-full border-2 border-black text-center text-xl font-semibold">
          Relatório de horas mensais
        </h1>
        <ul className="flex flex-col">
          <div className="flex min-w-full">
            <li className="flex w-[30vw] items-center justify-center border-b-2 border-l-2 border-black">
              <p className="font-bold">Local</p>
            </li>
            <li className="flex w-[20vw] items-center justify-center border-b-2  border-l-2 border-black">
              <p className="font-bold">Tipo</p>
            </li>
            <li className="flex w-[20vw] items-center justify-center border-b-2  border-l-2 border-black">
              <p className="font-bold">Data</p>
            </li>
            <li className="flex w-[20vw] items-center justify-center border-x-2  border-b-2 border-black">
              <p className="font-bold">Hora</p>
            </li>
            {loggedUser?.role === "ADM" && (
              <li className="flex w-[10vw] items-center justify-center border-b-2  border-r-2 border-black">
                <p className="font-bold">X</p>
              </li>
            )}
          </div>
          {checkins?.data?.map((checkin) => (
            <div key={undefined} className="flex">
              <li
                key={"instalation-" + checkin.id}
                className="flex w-[30vw] flex-1 items-center border-b-2  border-l-2 border-black"
              >
                <p className="truncate font-bold">{checkin.instalationName}</p>
              </li>
              <li
                key={"tipo-" + checkin.id}
                className="flex-2 flex w-[20vw] items-center border-b-2  border-l-2 border-black"
              >
                <p className="font-bold">
                  {checkin.tipo === "CHECKIN" ? "Checkin" : "Checkout"}
                </p>
              </li>
              <li
                key={"data-" + checkin.id}
                className="flex-2 flex w-[20vw] items-center justify-end border-b-2  border-l-2 border-black"
              >
                <p className="font-bold">
                  {new Date(checkin.timestamp)
                    .toLocaleDateString()
                    .substring(0, 5)}
                </p>
              </li>
              <li
                key={"hora-" + checkin.id}
                className="flex-2 flex w-[20vw] items-center justify-end border-x-2  border-b-2 border-black"
              >
                <p className="font-bold">
                  {new Date(checkin.timestamp)
                    .toLocaleTimeString()
                    .substring(0, 5)}
                </p>
              </li>
              {loggedUser?.role === "ADM" && (
                <li className="flex w-[10vw] items-center justify-center border-b-2  border-r-2 border-black">
                  <Trash2Icon
                    className="cursor-pointer text-red-500"
                    onClick={() => deleteCheckin.mutate(checkin.id)}
                  />
                </li>
              )}
            </div>
          ))}
        </ul>

        <div className="flex items-center justify-between border-x-2 border-b-2 border-black">
          <p className="flex flex-1 border-r-2 border-black">
            Horas produzidas:
          </p>
          <p className="flex flex-1 justify-end">
            {horasProduzidas?.toFixed(2)}
          </p>
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
