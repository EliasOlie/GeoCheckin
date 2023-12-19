/* eslint-disable react-hooks/exhaustive-deps */
import LoginForm from "@/components/Forms/LoginForm";
import { getCsrfToken } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function Home({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, []);

  return (
    <>
      <Head>
        <title>GeoCheckin</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Faça o login para continuar</h1>
          <p className="text-xm">É rapidinho!</p>
        </div>
        <LoginForm csrfToken={csrfToken ?? undefined} />
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: (await getCsrfToken(context)) ?? null,
    },
  };
}
