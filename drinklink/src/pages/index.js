// index.js

import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import BarCard from 'components/components/BarCard';

const Index = () => {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>DrinkLink</title>
    </Head>
      <Layout>
      <div className="flex flex-col md:flex-row items-center justify-center bg-white min-h-screen">
                <div className="w-full md:w-1/2 order-last md:order-first p-6 flex flex-col justify-center items-center">
                    <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">Welcome to DrinkLink</h1>
                    <p className="text-xl text-center text-gray-600 mb-8">Reserve your spot and enjoy your drink!</p>
                    <Link href="/signup">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-64 mb-6 focus:outline-none shadow-sm">
                            Get Started
                        </button>
                    </Link>
                </div>
                <div className="w-full md:w-1/2 order-first md:order-last h-full flex justify-center">
                    <img
                        src="https://abload.de/img/adobestock_1799976205gdihf.png"
                        alt="A bar image"
                        className="object-cover h-full w-7/10 mx-auto"
                    />
                </div>
            </div>
            <div className="bg-white py-16">
                <div className="container mx-auto px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Find the best bars near you.</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                        <BarCard />
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 text-white py-16">
                <div className="container mx-auto px-8">
                    <h2 className="text-3xl font-bold text-center mb-8">Join DrinkLink today.</h2>
                    <p className="text-center mb-8">Create an account and start discovering new cocktails and bars, connecting with other cocktail enthusiasts, and sharing your favorite drinks.</p>
                    <div className="flex justify-center">
                        <button className="border-0 bg-blue-500 hover:bg-blue-700 text-white px-8 py-2 rounded-lg focus:outline-none shadow-sm">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
      </Layout>    
    </>
  );
};

export default Index;
