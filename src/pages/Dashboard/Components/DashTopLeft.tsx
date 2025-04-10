
const DashTopLeft = () => {
    return (
        <div className="flex flex-col gap-5">
            {/* Header Section */}
            <div className="bg-white">
                <h1 className="text-2xl font-bold text-gray-800">
                    Order your desire Jewelry<br />
                    on your special Occasion
                </h1>
                <button className="flex items-center px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-md hover:bg-blue-700">
                    Learn More <span className="ml-1">→</span>
                </button>
            </div>

            {/* Today's Orders Section */}
            <div className="bg-white">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Today's Order</h2>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-sm text-left text-gray-500 border-b">
                                <th className="pb-2"></th>
                                <th className="pb-2">Item Name</th>
                                <th className="pb-2">Customer Name</th>
                                <th className="pb-2">QTY</th>
                                <th className="pb-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { item: 'Pram Set', customer: 'Henna Baptista', qty: '01', status: 'Completed' },
                                { item: 'Necklest', customer: 'Chance Korsgaard', qty: '02', status: 'Consolidated' },
                                { item: 'Pram Set', customer: 'Brendon Sighten', qty: '02', status: 'Meeting' },
                                { item: 'Rings', customer: 'Angel Korsgaard', qty: '02', status: 'Meeting' },
                                { item: 'Ear Rings', customer: 'Madelgin Curtis', qty: '02', status: 'Meeting' },
                            ].map((order, index) => (
                                <tr key={index} className="text-sm border-b">
                                    <td className="py-3">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 form-checkbox" />
                                    </td>
                                    <td className="py-3 text-gray-800">{order.item}</td>
                                    <td className="py-3 text-gray-600">{order.customer}</td>
                                    <td className="py-3 text-gray-600">{order.qty}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Consolidated' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Total Sales Section */}
            <div className="bg-white ">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Total Sales</h2>
                <div className="flex items-end h-40 space-x-1">
                    {[0, 100, 200, 300, 400, 500].reverse().map((value, index) => (
                        <div key={value} className="flex flex-col items-center flex-1">
                            <div className="mb-1 text-xs text-gray-500">${value}</div>
                            <div
                                className="w-full bg-blue-500 rounded-t-sm"
                                style={{ height: `${(value / 500) * 100}%` }}
                            ></div>
                            <div className="mt-1 text-xs text-gray-500">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashTopLeft;