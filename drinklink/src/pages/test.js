// signup.js

import Head from 'next/head';
import LoginForm from 'components/components/loginForm';
import SignupForm from 'components/components/signupForm';

export default function RegisterPage() {

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Test</title>
      </Head>
      <LoginForm>
      </LoginForm>
      <SignupForm>
      </SignupForm>
    </>
  );
}
