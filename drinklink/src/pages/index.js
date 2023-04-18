// index.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getCurrentUser } from '../lib/getCurrentUser';
import { logout } from '../lib/logout';

const Index = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await getCurrentUser();
      if (user) {
        setWelcomeMessage(`Willkommen, ${user.username}!`);
      } else {
        setWelcomeMessage('Bitte melden Sie sich an.');
      }
    }
    fetchCurrentUser();
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Startseite</title>
      </Head>
      <main>
        <h1>Willkommen auf unserer Website!</h1>
        <h2>{welcomeMessage}</h2>

        <Link href="/login">
          <button>Anmelden</button>
        </Link>
        <Link href="/register">
          <button>Registrieren</button>
        </Link>
        <Link href="/booking">
          <button>Buchungen</button>
        </Link>
        <Link href="/account">
          <button>Benutzerkonto</button>
        </Link>
        <button onClick={logout}>Abmelden</button>
      </main>
    </>
  );
};

export default Index;
