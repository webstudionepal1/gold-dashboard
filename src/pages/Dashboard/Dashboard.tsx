import { Icon } from "@iconify/react/dist/iconify.js";
import DashboardComp from "./Components/DashboardComp";

export const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Enhanced Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg">
                                <Icon icon="material-symbols:dashboard" className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                                <p className="text-sm text-slate-500">Welcome back! Here's your business overview</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex items-center px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                                <Icon icon="material-symbols:home-outline" className="w-4 h-4 text-amber-600 mr-2" />
                                <span className="text-sm font-medium text-amber-700">Dashboard</span>
                            </div>
                            <div className="flex items-center px-3 py-2 bg-slate-100 rounded-lg">
                                <Icon icon="material-symbols:schedule" className="w-4 h-4 text-slate-600 mr-2" />
                                <span className="text-sm text-slate-600">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
                <DashboardComp />
            </div>
        </div>
    );
};
