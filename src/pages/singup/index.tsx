import UserRegisterForm from "@/components/Forms/UserRegisterForm";
import Head from "next/head";

export default function Page() {

  return(
    <> 
      <Head>
        <title>GeoCheckin | Registre-se</title>
        <meta name="description" content="Faça o cadastro!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-2">
        <div>
          <h1 className="text-2xl font-bold">Registre-se na plataforma</h1>
          <p className="text-xs">Logo logo você já estará batendo o ponto!</p>
        </div>
        <UserRegisterForm />
      </main>
    </>
  )
}