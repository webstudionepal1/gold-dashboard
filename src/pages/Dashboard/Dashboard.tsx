import { Icon } from "@iconify/react/dist/iconify.js";
// import DashboardComp from "./Components/DashboardComp";
import DashboardComp from "./Components/DashboardComp";

export const DashboardPage = () => {
    return (
        <div className="p-7 bg-[#F4F4F5] flex flex-col gap-8">
            <div className="flex flex-row justify-between">
                <h2 className="text-3xl">Dashboard</h2>
                <div className="flex flex-row items-center gap-3 text-[#DF8D28]">
                    <Icon icon="mynaui:home" width="24" height="24" />
                    <p>Dashboard</p>
                </div>
            </div>
            <DashboardComp />

        </div>
    );
};
