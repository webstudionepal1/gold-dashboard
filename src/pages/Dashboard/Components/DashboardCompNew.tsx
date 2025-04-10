import DashBottom from "./DashBottom";
import DashTopLeft from "./DashTopLeft";
import DashTopRight from "./DashTopRight";

const DashboardCompNew = () => {
    return (
        <div className="flex flex-col p-5 gap-5 bg-[#F4F4F5]">
            <div className="flex flex-col gap-5 md:flex-row">
                <div className="w-full md:w-2/3">
                    <DashTopLeft />
                </div>
                <div className="w-full md:w-1/3">
                    <DashTopRight />
                </div>
            </div>
            <DashBottom />

        </div>
    );
};

export default DashboardCompNew;