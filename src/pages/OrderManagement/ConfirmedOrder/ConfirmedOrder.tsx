import dayjs from "dayjs";
import capitalize from "lodash/capitalize";
import get from 'lodash/get';
import invoke from 'lodash/invoke';
import map from 'lodash/map';
import size from 'lodash/size';
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { useGetAllOrdersQuery } from "../../../server/api/orderHooks";
import { confirmedColumns } from "../Order/orderObj";

// Filter state interface

const ConfirmedOrder = () => {
  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({
    orderStatus: "confirmed",
  });
  const navigate = useNavigate();

  const orderList = useMemo(
    () =>
      isSuccess && orders
        ? map(orders, (item) => ({
            ...item,
            orderedProducts: size(item.orderedProducts),
            orderStatus: (
              <div className="px-2 py-1 text-xs text-white rounded-full bg-green">
           {capitalize(item.orderStatus)}
              </div>
            ),
            customer: get(item, "customer.name", "-"),
            createdAt: (
              <div className="text-center">
                {invoke(dayjs(item.createdAt), "format", "MMMM D, YYYY")}
                <br />
                {invoke(dayjs(item.createdAt), "format", "h:mm A")}
              </div>
            ),
          }))
        : [],
    [isSuccess, orders]
  );

  return (
    <div>
      <Header text="Orders"></Header>
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          showAction
          loading={isLoading}
          viewAction={(row) =>
            navigate(`/order/confirmed-order-details/${row._id}`)
          }
          columns={confirmedColumns}
          rows={orderList}
        />
      </div>
    </div>
  );
};

export default ConfirmedOrder;
