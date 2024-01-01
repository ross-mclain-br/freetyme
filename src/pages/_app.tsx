import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "~/components/layout";

import { JetBrains_Mono } from "next/font/google";
import Controller from "~/utils/controller";
import { NextUIProvider } from "@nextui-org/react";

// If loading a variable font, you don't need to specify the font weight
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={jetbrainsMono.className}>
      <ClerkProvider {...pageProps}>
        <Controller>
          <NextUIProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NextUIProvider>
        </Controller>
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
