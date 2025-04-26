import SearcBar from "./SearchBar";

export default function Products() {
    return(
        <div className="mx-auto bg-white p-5 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Inventory Items</h2>
      {/* Search bar (optional) */}
      <SearcBar />
      {/* Table */}
      <table className="min-w-full table-auto border-collapse shadow-md">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 text-left">Име</th>
            <th className="px-4 py-2 text-left">Тип</th>
            <th className="px-4 py-2 text-left">Фирма</th>
            <th className="px-4 py-2 text-left">Бройки</th>
            <th className="px-4 py-2 text-left">Сегашна Цена</th>
            <th className="px-4 py-2 text-left">Предишна Цена</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody id="itemTableBody">
          {/* Example row */}
          
          <tr className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">Beer</td>
            <td className="px-4 py-2">Drink</td>
            <td className="px-4 py-2">Beer</td>

            <td className="px-4 py-2">10</td>
            <td className="px-4 py-2">$5.00</td>
            <td className="px-4 py-2">$4.80</td>
            <td className="px-4 py-2">
              <button className="text-blue-500 hover:underline">Edit</button>
              <button className="text-red-500 hover:underline ml-2">Delete</button>
            </td>
          </tr>
          {/* Add more rows dynamically here */}
        </tbody>
      </table>
      {/* Pagination (optional) */}
      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
      </div>
    </div>
    )

}