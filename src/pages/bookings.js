import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import BookingList from '../components/BookingList';

export default function Bookings() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Bookings</title>
      </Head>
      <Layout>
        <BookingList />
      </Layout>
    </>
  );
}
