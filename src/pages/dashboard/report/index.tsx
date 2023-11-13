import BottomBar from "@/components/BottomBar/BottomBar";
import Head from "next/head";

export default function ReportPage() {

  return(
    <>
      <Head>
        <title>GeoCheckin | Relatório</title>
        <meta name="description" content="Faça checkin!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        Report page
      </main>
      <BottomBar />
    </>
  )
}