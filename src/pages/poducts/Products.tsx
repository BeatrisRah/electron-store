import { useEffect, useState } from "react";
import SearcBar from "./SearchBar";
import { Product } from "../../types/productType";
import Form from "../create-update/Form";
import { ToastContainer } from "react-toastify";

export default function Products() {
  const [currentProduct, setCurretProduct] = useState<null | Product>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)

  useEffect(() => {
    window.ipcRenderer.invoke('get-all-items').then(data => console.log(data))
    
  }, [])

  const openEditForm = (productData: Product): void => {
    setCurretProduct(productData)
    setOpenModal(true)
  }

  const openCreateForm = (): void => {
    setCurretProduct(null)
    setOpenModal(true)
  }

  const closeModal = (): void => {
    setOpenModal(false)
  }

    return(
        <div className="mx-auto bg-white p-5 min-h-screen relative">
      <h2 className="text-2xl font-bold mb-4">Inventory Items</h2>
      <ToastContainer />

      <div className="flex">
      <SearcBar />
      {/* TODO: PLACE AT THE END */}
      <button
        onClick={() => openCreateForm()}
        className="border-2 p-2"
        >Add New</button> 
      </div>
      {openModal  && <Form initialData={currentProduct} onCancel={closeModal} />}
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
              <button onClick={() => openEditForm({
                id:'1',
                name: 'tesst',
                type: 'test',
                company: 'test',
                quantity: 10,
                currentPrice:1.50,
                lastPrice:1.40,})} className="text-blue-500 hover:underline">Edit</button>
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