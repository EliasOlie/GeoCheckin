import LoginForm from "@/components/Forms/LoginForm";
import Head from "next/head";

export default function Home() {

  return (
    <>
      <Head>
        <title>GeoCheckin</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Faça o login para continuar</h1>
          <p className="text-xm">É rapidinho!</p>
        </div>
        <LoginForm />
      </main>
    </>
  );
}