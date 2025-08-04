import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DashboardData } from "../../../server/api/dashboardHooks";
import { FrontendRoutes } from "../../../routes/routes";

interface DashBottomProps {
  dashboardData: DashboardData;
}

const DashBottom = ({ dashboardData }: DashBottomProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Enhanced Recent Transactions */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg">
                <Icon icon="material-symbols:receipt-long" className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
                <p className="text-sm text-slate-500">Latest payment activities</p>
              </div>
            </div>
            <Link
              to={FrontendRoutes.TRANSACTION}
              className="inline-flex items-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm">
              <span>View All</span>
              <Icon icon="material-symbols:arrow-forward" className="ml-1 w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                </th>
                <th className="px-6 py-3 text-left">Transaction ID</th>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dashboardData.recentTransactions?.length ? (
                dashboardData.recentTransactions.map((transaction) => (
                  <tr
                    key={
                      transaction._id ||
                      transaction.transactionId ||
                      transaction.orderId
                    }
                    className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                          <Icon icon="material-symbols:receipt" className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-slate-900">{transaction.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{transaction.orderId}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{transaction.orderDate}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${transaction.totalAmount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Icon icon="material-symbols:receipt-long-off" className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="text-sm text-slate-500">No recent transactions available</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Low Stock */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg">
                <Icon icon="material-symbols:inventory-2" className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Low Stock</h2>
                <p className="text-sm text-slate-500">Items running low</p>
              </div>
            </div>
            <Link
              to={FrontendRoutes.INVENTORY}
              className="inline-flex items-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm">
              <span>View All</span>
              <Icon icon="material-symbols:arrow-forward" className="ml-1 w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                </th>
                <th className="px-6 py-3 text-left">Item Name</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dashboardData.lowStockItems?.length ? (
                dashboardData.lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                        defaultChecked={item.id === 3 || item.id === 4}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                          <Icon icon="material-symbols:warning" className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-slate-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Icon icon="material-symbols:inventory-2-off" className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="text-sm text-slate-500">No low stock items available</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashBottom;
