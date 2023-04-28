import Head from 'next/head';
import Layout from '../components/Layout';
import BarCard from '../components/BarCard';
import SearchBar from '../components/SearchBar';

export default function FindBar() {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Find Bar</title>
      </Head>
    <Layout>
      <SearchBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        <BarCard />
      </div>
    </Layout>
    </>
  );
}
