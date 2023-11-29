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
import { GeolocationProps } from "@/utils/interfaces";
import CreateUserDialog from "@/components/Dialogs/CreateUserDialog";
import CreateInstalationDialog from "@/components/Dialogs/CreateInstalationDialog";

export default function Dashboard() {
  const { status } = useSession();
  const [location, setLocation] = useState<GeolocationProps>();
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
    console.log(location?.coords);
  }, [status]);

  return (
    <>
      <Head>
        <title>GeoCheckin | Dashboard</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-full min-h-screen ">
        <div className="flex items-center justify-between min-w-full p-4">
          <h2 className="text-xl font-bold">Olá {getUserQuery?.name} 👋</h2>
          <Button className="bg-red-500" onClick={() => signOut()}>
            Sair
          </Button>
        </div>
        <div className="bg-white h-[85vh] rounded-2xl shadow p-2">
          <div className="max-w-[50vw] mx-auto mt-4 border-2 border-black">
            {location !== undefined && (
              <QrReader
                onResult={(resultado, error) => {
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
            <div className="flex min-w-[50vw] mx-auto mt-4 px-2 items-center justify-between">
              <CreateUserDialog />
              {location && (
                <CreateInstalationDialog
                  latitude={location?.coords.latitude}
                  longitude={location?.coords.longitude}
                />
              )}
            </div>
          )}
        </div>
      </main>
      <BottomBar />
    </>
  );
}
