// signup.js

import Head from "next/head";
import Layout from "components/components/Layout";
import SignupForm from "components/components/SignupForm";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registrierung</title>
      </Head>
      <Layout>
        <div className="flex flex-col md:flex-row items-center justify-center bg-white min-h-screen">
          <SignupForm></SignupForm>
          <div className="w-full md:w-1/2 order-first md:order-last h-full flex justify-center">
            <img
              src="https://abload.de/img/adobestock_1799976205gdihf.png"
              alt="A bar image"
              className="object-cover h-full w-7/10 mx-auto"
            />
          </div>
        </div>
      </Layout>
    </>
  );
}
