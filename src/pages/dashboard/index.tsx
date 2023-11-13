/* eslint-disable react-hooks/exhaustive-deps */
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import BottomBar from "@/components/BottomBar/BottomBar";

export default function Dashboard() {
  const { data, status } = useSession()
  const router = useRouter()

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
        {data?.user.id}
        {data?.user.name}
        <p onClick={() => signOut()}>Sair</p>
      </main>
      <BottomBar />
    </>
  )
}