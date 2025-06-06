import { useState, useEffect, FormEvent } from "react";
import { Product } from "../../types/productType";
import { createItem } from "../../api/store-api";
import CreatableSelect from 'react-select/creatable'

type FormProps = {
    onCancel: () => void,
    initialData: Partial<Product> | null
}


export default function Form({initialData = null, onCancel }: FormProps) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [company, setCompany] = useState("");
    const [companyOptions, setCompanyOptions] = useState<{ label: string; value: string }[]>([])
    const [quantity, setQuantity] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [lastPrice, setLastPrice] = useState(0);

    useEffect(() => {
        window.ipcRenderer.invoke('get-companies').then((names: string[]) => {
            setCompanyOptions(names.map(name => ({ label: name, value: name })))
        })
    }, [])

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.name || "");
            setType(initialData.type || "");
            setQuantity(initialData.quantity || 0);
            setCurrentPrice(initialData.current_price || 0);
            setLastPrice(initialData.last_price || 0);
        }
    }, [initialData]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(!initialData){
            await createItem({name:title, type, company_name:company, quantity, current_price:currentPrice, last_price:lastPrice})
        }

        onCancel()

    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-1/2 border-2 border-gray-400 mx-auto absolute right-0 left-0 top-20"
        >
            <h2 className="text-2xl font-bold mb-4">
                {initialData?.id ? "Edit Item" : "Create New Item"}
            </h2>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>

            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Company</label>
            <CreatableSelect
                isClearable
                options={companyOptions}
                value={company ? { label: company, value: company } : null}
                onChange={(newValue) => setCompany(newValue?.value || '')}
                placeholder="Select or type a company..."
                className="text-black"
            />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                >
                    <option value="">Select a type</option>
                    <option value="Drink">Drink</option>
                    <option value="Food">Food</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    min="0"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Current Price</label>
                <input
                    type="number"
                    step="0.01"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    min="0"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Last Price</label>
                <input
                    type="number"
                    step="0.01"
                    value={lastPrice}
                    onChange={(e) => setLastPrice(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    min="0"
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {initialData?.id ? "Update Item" : "Create Item"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}