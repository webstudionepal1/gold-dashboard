import { Link } from "react-router-dom";
import { DashboardData } from "../../../server/api/dashboardHooks";
import { FrontendRoutes } from "../../../routes/routes";

interface DashBottomProps {
  dashboardData: DashboardData;
}

const DashBottom = ({ dashboardData }: DashBottomProps) => {
  return (
    <div className="flex flex-col h-full gap-5 md:flex-row">
      <div className="w-full h-[22rem] p-4 overflow-y-auto bg-white shadow-md rounded-xl md:w-2/3">
        <div className="flex flex-row items-center justify-between py-1 border-b border-gray-300">
          <h2 className="mb-4 text-xl font-semibold">Recent Transaction</h2>
          <Link
            to={FrontendRoutes.TRANSACTION}
            className="bg-white border-2 mb-4 border-[#F1D097] text-[#F1D097] px-2 py-[3px] rounded-md lg:text-base md:text-sm text-xs hover:bg-[#F1D097] hover:text-white transition-colors">
            View All
          </Link>
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
              {dashboardData.recentTransactions?.length ? (
                dashboardData.recentTransactions.map((transaction) => (
                  <tr
                    key={
                      transaction._id ||
                      transaction.transactionId ||
                      transaction.orderId
                    }
                    className="text-sm font-medium text-center text-gray-600 border-b">
                    <td className="py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 form-checkbox"
                      />
                    </td>
                    <td className="py-3">{transaction.transactionId}</td>
                    <td className="py-3">{transaction.orderId}</td>
                    <td className="py-3">{transaction.orderDate}</td>
                    <td className="py-3 text-[#22C55E]">
                      ${transaction.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No recent transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full h-[22rem] overflow-y-auto shadow-md rounded-xl p-4 bg-white md:w-1/3">
        <div className="flex flex-row items-center justify-between py-1 border-b border-gray-300">
          <h2 className="mb-4 text-xl font-semibold">Low Stock</h2>
          <Link
            to={FrontendRoutes.INVENTORY}
            className="bg-white border-2 mb-4 border-[#F1D097] text-[#F1D097] px-2 py-[3px] rounded-md lg:text-base md:text-sm text-xs hover:bg-[#F1D097] hover:text-white transition-colors">
            View All
          </Link>
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
              {dashboardData.lowStockItems?.length ? (
                dashboardData.lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    className="text-sm font-medium text-center text-gray-600 border-b">
                    <td className="py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 form-checkbox"
                        defaultChecked={item.id === 3 || item.id === 4}
                      />
                    </td>
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-[6px] rounded-full text-xs bg-[#FF4D4D] bg-opacity-15 text-[#FF4D4D]`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    No low stock items available
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
