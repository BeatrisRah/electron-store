import { Product } from "../../types/productType";

type ProductItemProps = Product

export default function ProductItem(data: ProductItemProps) {
    return (
        <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-2">{data.name}</td>
        <td className="px-4 py-2">{data.type}</td>
        <td className="px-4 py-2">{data.company}</td>

        <td className="px-4 py-2">{data.quantity} бр.</td>
        <td className="px-4 py-2">{data.currentPrice} лв.</td>
        <td className="px-4 py-2">{data.lastPrice} лв.</td>
        <td className="px-4 py-2">
          <button className="text-blue-500 hover:underline">Edit</button>
          <button className="text-red-500 hover:underline ml-2">Delete</button>
        </td>
      </tr>
    );
}