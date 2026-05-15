interface IInvetory {
  inventory: {
    [key: string]: string | number;
  }[];
}
export const Inventory: React.FC<IInvetory> = ({ inventory }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">Inventory</h3>
    <div className="grid grid-cols-3 gap-4">
      {inventory.map((item) =>
        Object.entries(item).map(([key, value]) => (
          <div key={key}>
            <p className="text-xs text-gray-500">{key}:</p>
            <p className="font-medium">{value}</p>
          </div>
        ))
      )}
    </div>
  </div>
);
