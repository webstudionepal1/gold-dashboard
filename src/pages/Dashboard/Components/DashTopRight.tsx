import PriceList1 from "../../../assets/images/PriceList1.png";
import { DonutChart } from "../../../components/ui/DonutChart";
import BarChart from "../../../components/ui/BarChart";
import { useEffect, useState } from "react";
import TopCustomer from '../../../assets/images/TopCustomers1.png';
import Marquee from 'react-fast-marquee';


const DashTopRight = () => {

    const [currentIndex, setCurrentIndex] = useState(0);



    const totalSalesData = {
        labels: ['Rings', 'Neckless', 'Others'],
        datasets: [
            {
                data: [30, 40, 30],
                backgroundColor: ['#f5d287', '#3e8e4e', '#7a8ca1'],
                borderWidth: 0,
            },
        ],
    };

    const totalSalesOptions = {
        cutout: '70%',
        plugins: {
            legend: {
                display: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const totalOrderData = {
        labels: ["Sun", "Mon", "Tue", "Thu", "Fri", "Sat"],
        datasets: [
            {
                label: "Neckless",
                data: [30, 30, 30, 30, 30, 30],
                backgroundColor: "#f5d287",
                borderRadius: 4,
                barThickness: 20,
            },
            {
                label: "Others",
                data: [40, 40, 40, 40, 40, 40],
                backgroundColor: "#7a8ca1",
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    const totalOrderOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#222", font: { weight: "500" } },
            },
            y: {
                grid: {
                    drawBorder: false,
                    color: "#eee",
                },
                ticks: {
                    color: "#999",
                    stepSize: 10,
                },
            },
        },
        maintainAspectRatio: false,
    };

    const todaysPriceData = [
        { img: PriceList1, price: '$290.00', title: 'Gold Price', bgColor: 'bg-[#FCF6EA]' },
        { img: PriceList1, price: '$300.00', title: 'Silver Price', bgColor: 'bg-[#ECEEF2]' },
        { img: PriceList1, price: '$295.00', title: 'Pasni Set Price', bgColor: 'bg-[#FFE5E5]' },
        { img: PriceList1, price: '$100.00', title: 'Silver Price', bgColor: 'bg-[#DDF4FF]' },
        { img: PriceList1, price: '$400.00', title: 'Gold Price', bgColor: 'bg-[#FCF6EA]' },

    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % todaysPriceData.length);
        }, 2000);

        return () => clearInterval(interval); // Clean up
    }, []);

    const { img, price, title, bgColor } = todaysPriceData[currentIndex];

    const topCustomers = [
        { img: TopCustomer, price: 11, name: 'Shishir Thapa' },
        { img: TopCustomer, price: 12, name: 'Jason Harvey' },
        { img: TopCustomer, price: 9, name: 'Undertaker' },
        { img: TopCustomer, price: 8, name: 'Hello World' },
        { img: TopCustomer, price: 10, name: 'Mac Donalds' },

    ]

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col w-full h-full gap-5">
                <h2 className="text-lg font-semibold lg:text-2xl md:text-xl">Today's Price List</h2>
                <div className={`${bgColor} rounded-xl px-4 py-4 shadow-md transition-all duration-300 ease-linear`}>
                    <div className="flex items-center w-full">
                        <div className="overflow-hidden rounded-lg w-14 h-14">
                            <img src={img} alt="Gold Icon" className="object-cover w-full h-full" />
                        </div>

                        <div className="ml-4">
                            <p className="lg:text-xl md:text-lg text-base font-bold text-[#333]">{price}</p>
                            <span className="text-xs text-gray-500 lg:text-base md:text-sm">{title}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full h-full p-4 bg-white shadow-md rounded-xl">
                    <h2 className="mb-4 text-base font-semibold text-left text-black lg:text-xl md:text-lg">Total Sales</h2>
                    <div className="flex items-center justify-center">
                        <DonutChart data={totalSalesData} options={totalSalesOptions} />
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-[#f5d287]"></span> Rings
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-[#3e8e4e]"></span> Neckless
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-[#7a8ca1]"></span> Others
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Order Chart */}
            <div className="bg-white p-4 rounded-xl shadow-md w-full h-[300px]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-black lg:text-xl md:text-lg">Total Order</h2>
                    <div className="text-sm font-medium text-[#f5d287] border border-[#f5d287] rounded-lg px-3 py-1 flex items-center gap-1">
                        Daily <span className="text-xs">▼</span>
                    </div>
                </div>
                <div className="h-[200px]">
                    <BarChart data={totalOrderData} options={totalOrderOptions} />
                </div>
            </div>

            {/* Top Customers Section */}
            <div className="flex flex-col w-full gap-2 p-4 overflow-hidden bg-white shadow-md rounded-xl">
                <h2 className="mb-3 text-base font-semibold lg:text-xl md:text-lg">Top Customer</h2>
                <div className="xl:w-[22rem] lg:w-[18rem] md:w-[18rem] w-[16rem] rounded-sm flex items-center justify-center overflow-hidden">
                    <Marquee pauseOnHover gradient={false} speed={50}>
                        {topCustomers.map((customer, index) => (
                            <div
                                key={index}
                                className="w-auto mx-[10px] bg-[#FCF6EA] rounded-xl shadow-md flex flex-col items-center lg:px-8 lg:py-5 md:px-7 md:py-4 px-6 py-3 text-center"
                            >
                                <div className="w-12 h-12 mb-3 overflow-hidden rounded-full lg:w-20 lg:h-20 md:w-16 md:h-16">
                                    <img
                                        src={customer.img}
                                        alt={customer.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="text-sm font-normal text-gray-800 lg:text-lg md:text-base">{customer.name}</div>
                                <div className="lg:text-sm md:text-[13px] text-sm text-gray-500">{customer.price} Purchase</div>
                            </div>
                        ))}
                    </Marquee>
                </div>

            </div>
        </div>
    );
};

export default DashTopRight;