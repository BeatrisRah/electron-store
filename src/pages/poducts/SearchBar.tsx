import { useState } from "react";


export default function SearcBar() {
    const [searchField, setSearchField] = useState("title");
    const [query, setQuery] = useState("");

    const fields = [
        { value: "title", label: "Име" },
        { value: "quantity", label: "Брой" },
        { value: "category", label: "Тип" },
        { value: "price", label: "Сегашна Цена" },
        { value: "company", label: "Фирма" },
    ];

    return (
        <div className="flex items-center gap-4 p-4 bg-white w-full max-w-xl ">
            {/* Dropdown */}
            <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {fields.map((field) => (
                    <option key={field.value} value={field.value}>
                        {field.label}
                    </option>
                ))}
            </select>

            {/* Input */}
            <input
                type="text"
                placeholder={`Search by ${searchField}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Search button */}
            <button
                onClick={() => console.log(`Searching ${searchField} for "${query}"`)}
                className="p-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Search
            </button>
        </div>
    );
}