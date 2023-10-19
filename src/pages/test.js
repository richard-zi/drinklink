// signup.js

import Head from 'next/head';
import LoginForm from 'components/components/LoginForm';
import SignupForm from 'components/components/SignupForm';
import SearchBar from 'components/components/SearchBar';
import BarCard from 'components/components/BarCard';
import BookingForm from 'components/components/BookingForm';

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
      <BarCard>
      </BarCard>
      <SearchBar>
      </SearchBar>
      <BookingForm>
      </BookingForm>
    </>
  );
}
