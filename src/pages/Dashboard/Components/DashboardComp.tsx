import { BentoGrid, BentoGridItem } from "../../../components/ui/bento-grid";
import BrideImage from "../../../assets/images/BrideImage.png";
import BrideImageBg from "../../../assets/images/BrideImageBg.png";
import PriceList1 from "../../../assets/images/PriceList1.png";


const DashboardComp = () => {
    return (
        <div>
            <BentoGrid className="gap-6">
                <BentoGridItem
                    className="relative h-[16rem] p-0 md:col-span-2"
                    header={
                        <div className="relative z-10 flex flex-col items-center justify-between w-full h-full px-6 py-8 md:flex-row rounded-xl">
                            <img
                                src={BrideImageBg}
                                alt="Background"
                                className="absolute inset-0 z-0 object-cover w-full h-full scale-100 rounded-xl"
                            />
                            <div className="z-10 w-full mb-6 text-left md:w-1/2 md:mb-0">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#A14F02] leading-snug">
                                    Order your desire Jewelry <br /> on your special Occasion
                                </h2>
                                <a
                                    href="#"
                                    className="inline-flex items-center text-[#A14F02] text-sm font-semibold mt-4 hover:underline"
                                >
                                    Learn More <span className="ml-1">→</span>
                                </a>
                            </div>

                            <div className="relative z-10 flex justify-center w-full md:w-1/2 md:justify-end">
                                <img
                                    src={BrideImage}
                                    alt="Jewelry Promo"
                                    className="h-[250px] md:h-[320px] object-contain translate-y-[-10%]"
                                />
                            </div>
                        </div>
                    }
                />




                <div className="flex flex-col w-full h-full gap-5">
                    <h2 className="text-2xl font-semibold">Today's Price List</h2>
                    <BentoGridItem
                        className="bg-[#FCF6EB] rounded-xl px-4 py-4 shadow-sm"
                        header={
                            <div className="flex items-center w-full">
                                <div className="overflow-hidden rounded-lg w-14 h-14">
                                    <img src={PriceList1} alt="Gold Icon" className="object-cover w-full h-full" />
                                </div>

                                <div className="ml-4">
                                    <p className="text-lg font-semibold text-[#333]">$290.00</p>
                                    <span className="text-sm text-gray-500">Gold Price</span>
                                </div>
                            </div>
                        }
                    />
                    <BentoGridItem
                        title="$290.00"
                        description="Gold Price"
                        icon={<span className="text-2xl">🪙</span>}
                    />
                </div>


                <BentoGridItem
                    className="md:col-span-2"
                    title="Today's Order"
                    description={
                        <div className="mt-2 overflow-x-auto text-sm">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th>Item</th>
                                        <th>Customer</th>
                                        <th>Qty</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    <tr><td>Pasni Set</td><td>Hanno Baptista</td><td>01</td><td className="text-green-500">Completed</td></tr>
                                    <tr><td>Neckless</td><td>Chance Korsgaard</td><td>02</td><td className="text-red-500">Cancelled</td></tr>
                                    <tr><td>Pasni Set</td><td>Brandon Siphorn</td><td>02</td><td className="text-yellow-500">In Pending</td></tr>
                                </tbody>
                            </table>
                        </div>
                    }
                />

                <BentoGridItem

                    title="Total Sales"
                    description="Rings, Neckless, Others"
                    icon={
                        <div className="flex items-center justify-center w-32 h-32 text-sm bg-gray-100 rounded-full">
                            Pie Chart Here
                        </div>
                    }
                />

                <BentoGridItem

                    title="Total Orders"
                    description="Daily Order Count"
                    icon={
                        <div className="flex items-center justify-center w-full h-32 text-sm bg-gray-100">
                            Bar Chart Here
                        </div>
                    }
                />

                <BentoGridItem

                    className="md:col-span-2"
                    title="Total Sales"
                    description="Daily Sales Data"
                    icon={
                        <div className="flex items-center justify-center w-full h-32 text-sm bg-orange-50">
                            Line Chart Here
                        </div>
                    }
                />

                <BentoGridItem

                    title="Top Customers"
                    description={
                        <div className="flex gap-4 mt-2">
                            <div>
                                <img src="/avatar1.png" className="w-12 h-12 rounded-full" />
                                <p className="text-xs">Miracle Dokidis<br />12 Purchases</p>
                            </div>
                            <div>
                                <img src="/avatar2.png" className="w-12 h-12 rounded-full" />
                                <p className="text-xs">Jason Harvey<br />11 Purchases</p>
                            </div>
                        </div>
                    }
                />

                <BentoGridItem

                    className="md:col-span-2"
                    title="Recent Transactions"
                    description={
                        <table className="w-full mt-2 text-xs">
                            <thead>
                                <tr className="text-left">
                                    <th>ID</th>
                                    <th>Order</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>#12</td><td>#23</td><td>2021-02-10</td><td className="text-green-500">$1200.00</td></tr>
                                <tr><td>#12</td><td>#23</td><td>2021-02-10</td><td className="text-green-500">$900.00</td></tr>
                            </tbody>
                        </table>
                    }
                />

                <BentoGridItem

                    title="Low Stock"
                    description={
                        <table className="w-full mt-2 text-xs">
                            <thead>
                                <tr className="text-left">
                                    <th>Item</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Neckless</td><td className="text-red-500">Low Stock</td></tr>
                                <tr><td>Pasni Set</td><td className="text-red-500">Low Stock</td></tr>
                            </tbody>
                        </table>
                    }
                />
            </BentoGrid>
        </div>
    )
}

export default DashboardComp
