/* eslint-disable react-hooks/exhaustive-deps */
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { QrReader } from 'react-qr-reader';
import Head from "next/head";
import BottomBar from "@/components/BottomBar/BottomBar";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { status } = useSession()
  const [ data, setData ] = useState<string>("Sem resultado")
  const router = useRouter()
  const getUserQuery = api.user.getUser.useQuery().data

  useEffect(() => {
    if(status === "unauthenticated") {
      router.push("/")
    }
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
          <Button className="bg-red-500">Sair</Button>
        </div>
        <div className="max-w-[50vw] mx-auto mt-4 border-2 border-black">
          <QrReader
          onResult={(resultado, error) => {
            if (!!resultado) {
              setData(resultado?.getText());
            }

            if (!!error) {
              console.info(error);
            }
          }}
            constraints={ { aspectRatio: 1/1, facingMode: "environment" } }
          />
        </div>
      
      </main>
      <BottomBar />
    </>
  )
}
