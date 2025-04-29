import { useMemo } from "react";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import { useGetAllProductsQuery } from "../../server/api/productHooks";
import { inventoryColumns } from "./inventoryObj";
import { get } from "lodash";

const InventoryIndex = () => {
  const { data, isSuccess } = useGetAllProductsQuery();
  const inventoryData = useMemo(
    () =>
      isSuccess
        ? data
            ?.flatMap((item) =>
              get(item, "variant", []).map((variant) => ({
                ...item,
                ...variant,
              }))
            )
            .map((item, index: number) => ({
              ...item,
              sn: index + 1,
              wt:get(item, 'wt', '-'),
              id: get(item, "_id", "-"),
              item: `${get(item, "name", "")} (${get(item, "wt", "-")})`,
            }))
        : [],
    [data, isSuccess]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Stock":
        return "bg-[#e9fbef] text-[#1dc45e] px-8";
      case "Low Stock":
        return "bg-[#fffae6] text-[#ffcc01] px-8";
      case "Out of Stock":
        return "bg-[#ffeceb] text-[#ff3a2f] px-7";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="">
      <Header text="Inventory" />

      <div className="bg-[#ffffff] border-[#dcdddf] pb-[1rem] border rounded-md">
        <MasterTable
          columns={inventoryColumns}
          rows={inventoryData}
          showAction
          viewAction={() => {}}
        />
      </div>
    </div>
  );
};

export default InventoryIndex;
