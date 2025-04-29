
export const Inventory: React.FC<Record<string, string | number>> = ({
  inventory,
}) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold">Inventory</h3>
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(inventory).map(([label, index]) => (
        <div key={label}>
          <p className="text-xs text-gray-500">{label}:</p>
          <p className="font-medium">{index}</p>
        </div>
      ))}
    </div>
  </div>
);
