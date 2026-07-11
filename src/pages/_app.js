import "@/styles/globals.css";
import Head from "next/head"; // 1. Importo Head
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      
      <Head>
        <title>ParkZone</title>
        <meta name="description" content="Platforma #1 në Kosovë për menaxhimin e parkingjeve në kohë reale." />
        <link rel="icon" href="/favicon.png" />
        {/* <link rel="icon" type="image/png" href="/logo.png" /> */}
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50 text-black">
        <Navbar />
        
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        <Footer />
      </div>
    </SessionProvider>
  );
}