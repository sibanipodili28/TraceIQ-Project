import Head from "next/head";
import { ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Box } from "@mui/material";
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Head>
        <title>TraceIQ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Box sx={{ flexShrink: 0 }}>
          <Navbar />
        </Box>
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Box
            sx={{
              width: 240,
              flexShrink: 0,
              borderRight: "1px solid #e0e0e0",
              bgcolor: "#f9fafb",
            }}
          >
            <Sidebar />
          </Box>
          <Box
            component="main"
            sx={{
              flex: 1,
              p: 3,
              overflowY: "auto",
              bgcolor: "#f5f5f5",
            }}
          >
            {children}
          </Box>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Footer />
        </Box>
      </Box>
    </>
  );
}