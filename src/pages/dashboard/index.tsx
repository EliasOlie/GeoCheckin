/* eslint-disable react-hooks/exhaustive-deps */
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { QrReader } from 'react-qr-reader';
import Head from "next/head";
import BottomBar from "@/components/BottomBar/BottomBar";

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
      <main>
        {getUserQuery?.id}
        {getUserQuery?.name}
        <p onClick={() => signOut()}>Sair</p>
        
        <div className="max-w-[50vw] mx-auto mt-4">

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
      <p>{data}</p>
      </main>
      <BottomBar />
    </>
  )
}
