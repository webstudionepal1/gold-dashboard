
const DashTopRight = () => {
    return (
        <div className="flex flex-col gap-5">
            <div className="bg-white">
                <h2 className="mb-2 text-xl font-semibold text-gray-700">Today's Price List</h2>
                <div className="text-3xl font-bold text-gray-800">$290.00</div>
                <div className="text-gray-600">Gold Price</div>
            </div>

            {/* Total Sales Section */}
            <div className="bg-white">
                <h2 className="mb-3 text-xl font-semibold text-gray-700">Total Sales</h2>
                <ul className="space-y-2">
                    {['Rings', 'Neckless', 'Others'].map((item) => (
                        <li key={item} className="text-gray-700">{item}</li>
                    ))}
                </ul>
            </div>

            {/* Total Order Chart */}
            <div className="bg-white">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-700">Total Order</h2>
                    <span className="text-sm text-gray-500">Daily</span>
                </div>
                <div className="flex items-end h-40 space-x-2">
                    {[10, 20, 30, 40, 50, 60, 70].reverse().map((value, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div className="mb-1 text-xs text-gray-500">{value}</div>
                            <div
                                className="w-full bg-green-500 rounded-t-sm"
                                style={{ height: `${(value / 70) * 100}%` }}
                            ></div>
                            <div className="mt-1 text-xs text-gray-500">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Customers Section */}
            <div className="bg-white">
                <h2 className="mb-3 text-xl font-semibold text-gray-700">Top Customer</h2>
                <div className="space-y-4">
                    <div>
                        <div className="font-medium text-gray-800">Miracle Dolddis</div>
                        <div className="text-sm text-gray-600">12 Profiles</div>
                    </div>
                    <div>
                        <div className="font-medium text-gray-800">Jason Harvey</div>
                        <div className="text-sm text-gray-600">11 Profiles</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashTopRight;