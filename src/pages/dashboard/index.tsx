/* eslint-disable react-hooks/exhaustive-deps */
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { QrReader } from 'react-qr-reader';
import Head from "next/head";
import BottomBar from "@/components/BottomBar/BottomBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { GeolocationProps } from "@/utils/interfaces";

export default function Dashboard() {
  const { status } = useSession()
  const [ data, setData ] = useState<string>("Sem resultado")
  const [ location, setLocation ] = useState<GeolocationProps>()
  const { toast } = useToast()
  const router = useRouter()
  const getUserQuery = api.user.getUser.useQuery().data
  
  const checkIn = api.dailly.checkIn.useMutation({
    onSuccess(_, variables) {
      toast({
        title: "Ponto batido!",
        description: "Você pode prosseguir!"
      })
    },
    onError: () => {
      toast({
        title: "Ops parece que algo deu errado",
        description: "Tente novamente, se persistir, chame o suporte",
        variant: "destructive"
      })
    }
  })
  const checkOut = api.dailly.checkOut.useMutation({})

  useEffect(() => {
    if(status === "unauthenticated") {
      router.push("/")
    }
     window.navigator.geolocation.getCurrentPosition((pos) => setLocation(pos), console.error)
    console.log(location)

  }, [status])

  return(
    <>
      <Head>
        <title>GeoCheckin | Dashboard</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-full min-h-screen">
        <div className="flex items-center justify-between min-w-full px-4 mt-4">
         <h2 className="text-xl font-bold">Olá {getUserQuery?.name} 👋</h2>
          <Button className="bg-red-500" onClick={() => signOut()}>Sair</Button>
        </div>
        <div className="max-w-[50vw] mx-auto mt-4 border-2 border-black">
          <QrReader
          onResult={(resultado, error) => {
            if (!!resultado) {
              if(resultado.getText() === "checkin") {
                  checkIn.mutate({
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                  })
              }
              else if(resultado.getText() === "checkout") {
                checkOut.mutate({
                  longitude: location.coords.longitude,
                  latitude: location.coords.latitude,
                })
              }
              setData(resultado?.getText());
            }

            if (!!error) {
              console.info(error);
            }
          }}
            constraints={ { aspectRatio: 1/1, facingMode: "environment" } }
          />
        </div>
        {data}
      </main>
      <BottomBar />
    </>
  )
}
