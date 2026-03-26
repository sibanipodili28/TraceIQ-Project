import Head from "next/head";
import { ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Head>
        <title>V.Erde</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="app-container">
        {/* Top Navbar */}
        <Navbar />

        <div className="main-layout">
          {/* Sidebar */}
          <Sidebar />

          {/* Page Content */}
          <main className="content">
            {/* <SnackbarProvider
              autoHideDuration={4000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {children}
            </SnackbarProvider> */}
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}