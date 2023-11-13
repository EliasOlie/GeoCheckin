import BottomBar from "@/components/BottomBar/BottomBar";
import EditUserForm from "@/components/Forms/EditUserForm";
import Head from "next/head";

export default function UserPage() {

  return(
    <>
      <Head>
        <title>GeoCheckin | Usuário</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center mt-10 px-4">
        <EditUserForm />
      </main>
      <BottomBar />
    </>
  )
}