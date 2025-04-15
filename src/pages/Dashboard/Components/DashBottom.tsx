
const DashBottom = () => {
    return (
        <div className="flex flex-col h-full gap-5 md:flex-row">
            <div className="w-full h-[22rem] p-4 overflow-y-auto bg-white shadow-md rounded-xl md:w-2/3">
                <div className="flex flex-row items-center justify-between py-1 border-b border-gray-300">
                    <h2 className="mb-4 text-xl font-semibold">Recent Transaction</h2>
                    <button className="bg-white border-2 mb-4 border-[#F1D097] text-[#F1D097] px-2 py-[3px] rounded-md lg:text-base md:text-sm text-xs">View All</button>
                </div>
                <div className="mt-3 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-sm text-center text-[#15112C] tracking-wide border-b">
                                <th className="pb-2"></th>
                                <th className="pb-2">Transaction ID</th>
                                <th className="pb-2">Order ID</th>
                                <th className="pb-2">Order Date</th>
                                <th className="pb-2">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { transactionId: '#12', orderId: '#23', orderDate: '2021-02-10', totalAmount: '$1200.00' },
                                { transactionId: '#13', orderId: '#24', orderDate: '2021-02-10', totalAmount: '$1200.00' },
                                { transactionId: '#14', orderId: '#25', orderDate: '2021-02-10', totalAmount: '$1200.00' },
                                { transactionId: '#15', orderId: '#26', orderDate: '2021-02-10', totalAmount: '$1200.00' },
                                { transactionId: '#16', orderId: '#27', orderDate: '2021-02-10', totalAmount: '$1200.00' },
                            ].map((order, index) => (
                                <tr key={index} className="text-sm font-medium text-center text-gray-600 border-b">
                                    <td className="py-3">
                                        <input type="checkbox" className="w-4 h-4 form-checkbox" />
                                    </td>
                                    <td className="py-3">{order.transactionId}</td>
                                    <td className="py-3">{order.orderId}</td>
                                    <td className="py-3">{order.orderDate}</td>
                                    <td className="py-3 text-[#22C55E]">{order.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="w-full h-[22rem] overflow-y-auto shadow-md rounded-xl p-4 bg-white md:w-1/3">
                <div className="flex flex-row items-center justify-between py-1 border-b border-gray-300">
                    <h2 className="mb-4 text-xl font-semibold">Low Stock</h2>
                    <button className="bg-white border-2 mb-4 border-[#F1D097] text-[#F1D097] px-2 py-[3px] rounded-md lg:text-base md:text-sm text-xs">View All</button>
                </div>
                <div className="mt-3 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-sm text-center text-[#15112C] border-b">
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
                                <tr key={item.id} className="text-sm font-medium text-center text-gray-600 border-b">
                                    <td className="py-3">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 form-checkbox"
                                            defaultChecked={item.id === 3 || item.id === 4}
                                        />
                                    </td>
                                    <td className="py-3">{item.name}</td>
                                    <td className="py-3">
                                        <span className={`px-3 py-[6px] rounded-full text-xs bg-[#FF4D4D] bg-opacity-15 text-[#FF4D4D]`}>
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
