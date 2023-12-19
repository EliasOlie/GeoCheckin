/* eslint-disable react-hooks/exhaustive-deps */
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { QrReader } from "react-qr-reader";
import Head from "next/head";
import BottomBar from "@/components/BottomBar/BottomBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { GeolocationProps } from "@/utils/interfaces";
import CreateUserDialog from "@/components/Dialogs/CreateUserDialog";
import CreateInstalationDialog from "@/components/Dialogs/CreateInstalationDialog";
import EditUserUserDialog from "@/components/Dialogs/EditUserDialog";

export default function Dashboard() {
  const { status } = useSession();
  const [location, setLocation] = useState<GeolocationProps>();
  const [stopScan, setStopScan] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();
  const getUserQuery = api.user.getUser.useQuery().data;

  const checkIn = api.dailly.checkIn.useMutation({
    onSuccess() {
      toast({
        title: "Ponto batido!",
        description: "Você pode prosseguir!",
      });
      router.push("/dashboard/report");
    },
    onError: (err) => {
      toast({
        title: "Ops parece que algo deu errado.",
        description: err.message,
        variant: "destructive",
      });
      setStopScan(true);
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    window.navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos),
      console.error,
    );
  }, [status]);

  return (
    <>
      <Head>
        <title>GeoCheckin | Dashboard</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen min-w-full px-2 ">
        <div className="flex min-w-full items-center justify-between p-4">
          <h2 className="text-xl font-bold">Olá {getUserQuery?.name} 👋</h2>
          <Button className="bg-red-500" onClick={() => signOut()}>
            Sair
          </Button>
        </div>
        <div className="h-[85vh] rounded-2xl bg-white p-2 shadow">
          <h3 className="w-full text-center text-lg font-bold">
            Escanear QRCode
          </h3>

          <div className="mx-auto mt-4 max-w-[50vw] border-2 border-black">
            {location !== undefined && stopScan && (
              <QrReader
                onResult={(resultado, error) => {
                  setTimeout(() => setStopScan(true), 1500);
                  setStopScan(true);

                  if (!!resultado) {
                    if (resultado.getText() === "checkin") {
                      checkIn.mutate({
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                        tipo: "in",
                      });
                    } else if (resultado.getText() === "checkout") {
                      checkIn.mutate({
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                        tipo: "out",
                      });
                    }
                  }

                  if (!!error) {
                    console.info(error);
                  }
                }}
                constraints={{ aspectRatio: 1 / 1, facingMode: "environment" }}
              />
            )}
          </div>
          {getUserQuery?.role === "ADM" && (
            <div className="mx-auto mt-4 flex min-w-[50vw] flex-col items-center justify-center gap-4 px-2">
              <div className="flex gap-4">
                <CreateUserDialog />
                <CreateInstalationDialog />
              </div>

              <div className="w-full">
                <EditUserUserDialog />
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomBar />
    </>
  );
}
