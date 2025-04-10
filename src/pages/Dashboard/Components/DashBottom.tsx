
const DashBottom = () => {
    return (
        <div className="flex flex-col gap-5 md:flex-row">
            {/* Recent Transactions Section */}
            <div className="w-full bg-white md:w-2/3">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Recent Transaction</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-sm text-left text-gray-500 border-b">
                                <th className="pb-2"></th>
                                <th className="pb-2">Transaction ID</th>
                                <th className="pb-2">Order ID</th>
                                <th className="pb-2">Order Date</th>
                                <th className="pb-2">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((item) => (
                                <tr key={item} className="text-sm border-b">
                                    <td className="py-3">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 form-checkbox" />
                                    </td>
                                    <td className="py-3 text-gray-800">#12</td>
                                    <td className="py-3 text-gray-800">#23</td>
                                    <td className="py-3 text-gray-600">2021-02-10</td>
                                    <td className="py-3 text-gray-800">$1200.00</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            <div className="w-full bg-white md:w-1/3">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Low Stock</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-sm text-left text-gray-500 border-b">
                                <th className="pb-2"></th>
                                <th className="pb-2">Item Name</th>
                                <th className="pb-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 3, name: 'Neckless', status: 'Low Stock' },
                                { id: 2, name: 'Pasni Set', status: 'Low Stock' },
                                { id: 4, name: 'Neckless', status: 'Low Stock' },
                            ].map((item) => (
                                <tr key={item.id} className="text-sm border-b">
                                    <td className="py-3">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 form-checkbox"
                                            defaultChecked={item.id === 3 || item.id === 4}
                                        />
                                    </td>
                                    <td className="py-3 text-gray-800">{item.name}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 text-xs text-red-800 bg-red-100 rounded-full">
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashBottom;
