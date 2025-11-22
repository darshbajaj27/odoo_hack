"use client"

import { Search, Filter } from "lucide-react"
import { useState } from "react"

interface MoveHistoryProps {
  onNavigate: (view: string) => void
}

const mockMoves = [
  {
    id: 1,
    date: "2024-11-25",
    ref: "WH/IN/001",
    product: "Steel Rods 12mm",
    fromLoc: "Supplier",
    toLoc: "Warehouse A",
    qty: 100,
    type: "in",
  },
  {
    id: 2,
    date: "2024-11-25",
    ref: "WH/OUT/002",
    product: "Concrete Mix 40kg",
    fromLoc: "Warehouse A",
    toLoc: "Customer B",
    qty: 50,
    type: "out",
  },
  {
    id: 3,
    date: "2024-11-24",
    ref: "WH/ADJ/001",
    product: "Rebar 16mm",
    fromLoc: "Warehouse A",
    toLoc: "Warehouse B",
    qty: 30,
    type: "in",
  },
  {
    id: 4,
    date: "2024-11-24",
    ref: "WH/OUT/001",
    product: "Azure Interior Panels",
    fromLoc: "Warehouse A",
    toLoc: "Customer A",
    qty: 10,
    type: "out",
  },
  {
    id: 5,
    date: "2024-11-23",
    ref: "WH/IN/003",
    product: "Fasteners Box",
    fromLoc: "Supplier",
    toLoc: "Warehouse B",
    qty: 200,
    type: "in",
  },
]

export function MoveHistory({ onNavigate }: MoveHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = mockMoves.filter(
    (m) =>
      m.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.product.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Move History</h1>
        <p className="text-slate-600 dark:text-gray-400 mt-1">Track all stock movements and transfers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search reference or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 outline-none transition-all"
          />
        </div>
        <button className="h-11 px-4 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Reference</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">From Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">To Location</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((move) => (
                <tr key={move.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">{move.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{move.ref}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{move.product}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">{move.fromLoc}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={move.type === "in" ? "text-green-600 dark:text-green-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                      {move.type === "in" ? "+" : "-"} {move.toLoc}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">{move.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filtered.map((move) => (
            <div
              key={move.id}
              className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{move.ref}</p>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{move.product}</p>
                </div>
                <span className={`text-lg font-bold ${move.type === "in" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {move.type === "in" ? "+" : "-"}
                  {move.qty}
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-600 dark:text-gray-400">
                <p>{move.date}</p>
                <p className={move.type === "in" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {move.fromLoc} → {move.toLoc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
