import Layout from '../components/Layout';

export default function BecomePartner() {
    return (
        <Layout>
            <div className="flex flex-col md:flex-row items-center justify-center bg-white min-h-screen">
                <div className="w-full md:w-1/2 order-last md:order-first p-6 flex flex-col justify-center items-center">
                    <div className="bg-white shadow-lg rounded-lg p-8 w-4/5 md:w-full">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Become a DrinkLink Partner</h1>
                        <p className="text-center text-gray-600 text-sm mb-8">Please fill out the information below to apply for partnership with DrinkLink.</p>
                        <form className="mb-8">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="name"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="Name of your bar"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="address"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="Address of your bar"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="phone"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="Phone number"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    id="email"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="number"
                                    id="seats"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="Number of available seats"
                                />
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm">
                                Apply to become a partner
                            </button>
                        </form>
                    </div>
                </div>
                <div className="w-full md:w-1/2 order-first md:order-last h-full flex justify-center">
                    <img
                        src="https://abload.de/img/adobestock_1799976205gdihf.png"
                        alt="A bar image"
                        className="object-cover h-full w-7/10 mx-auto"
                    />
                </div>
            </div>
        </Layout>
    );
}
