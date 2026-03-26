import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

// import { LicenseInfo } from "@mui/x-license";
import RootLayout from "../global/layout";

// ✅ Set MUI License (if exists)
// if (process.env.NEXT_PUBLIC_MUI_LICENSE_KEY) {
//   LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE_KEY);
// }

// ✅ Extend NextPage to support custom layout
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

// ✅ Extend AppProps
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({
  Component,
  pageProps,
}: AppPropsWithLayout) {
  // ✅ If page has custom layout → use it
  const getLayout =
    Component.getLayout || ((page: ReactElement) => page);

  return (
    <RootLayout>
      {/* <Providers>
        <AuthProvider> */}
          {getLayout(<Component {...pageProps} />)}
        {/* </AuthProvider>
      </Providers> */}
    </RootLayout>
  );
}