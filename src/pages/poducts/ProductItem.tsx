import { Product } from "../../types/productType";

type ProductItemProps = {
  data: Product
  onOpen: (data: Product) => void;
}

export default function ProductItem({data, onOpen}: ProductItemProps,) {
  
    return (
      <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-2">{data.name}</td>
        <td className="px-4 py-2">{data.type}</td>
        <td className="px-4 py-2">{data.company_name}</td>

        <td className="px-4 py-2">{data.quantity} бр.</td>
        <td className="px-4 py-2">{data.current_price} лв.</td>
        <td className="px-4 py-2">{data.last_price} лв.</td>
        <td className="px-4 py-2">
          <button onClick={() => onOpen(data)} className="text-blue-500 hover:underline">Edit</button>
          <button className="text-red-500 hover:underline ml-2">Delete</button>
        </td>
      </tr>
    );
}