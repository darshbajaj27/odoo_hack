"use client"

import { ChevronLeft, Check, Printer, X } from "lucide-react"
import { useState } from "react"

interface OperationDetailViewProps {
  operationId: string
  onNavigate: (view: string) => void
}

export function OperationDetailView({ operationId, onNavigate }: OperationDetailViewProps) {
  const [status, setStatus] = useState("Ready")
  const [products, setProducts] = useState([
    { id: 1, name: "Steel Rods 12mm", demandQty: 100, doneQty: 85 },
    { id: 2, name: "Concrete Mix 40kg", demandQty: 50, doneQty: 50 },
    { id: 3, name: "Rebar 16mm", demandQty: 75, doneQty: 45 },
  ])

  const statusStages = ["Draft", "Waiting", "Ready", "Done"]
  const currentStageIndex = statusStages.indexOf(status)

  const handleProductUpdate = (id: number, newDoneQty: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, doneQty: newDoneQty } : p)))
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate("operations-list")}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <p className="text-sm text-slate-600 dark:text-gray-400">Operations / Receipts</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{operationId}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3">
            {status === "Draft" && (
              <button
                onClick={() => setStatus("Waiting")}
                className="flex-1 h-11 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors"
              >
                Mark as Waiting
              </button>
            )}
            {status === "Ready" && (
              <>
                <button
                  onClick={() => setStatus("Done")}
                  className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Validate
                </button>
                <button className="flex-1 h-11 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Printer size={20} />
                  Print
                </button>
                <button
                  onClick={() => setStatus("Cancelled")}
                  className="h-11 px-6 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X size={20} />
                </button>
              </>
            )}
          </div>

          {/* Status Pipeline */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-4">Status Pipeline</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {statusStages.map((stage, idx) => (
                <div key={stage} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      idx <= currentStageIndex ? "bg-green-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-400"
                    }`}
                  >
                    {idx < currentStageIndex ? <Check size={16} /> : idx + 1}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300 whitespace-nowrap">{stage}</span>
                  {idx < statusStages.length - 1 && <div className="w-6 h-0.5 mx-1 bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Receive From</label>
                <select className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 outline-none">
                  <option>Steel Suppliers Inc</option>
                  <option>Azure Interior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  defaultValue="2024-11-25"
                  className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Source Document</label>
              <input
                type="text"
                placeholder="PO/2024/001"
                defaultValue="PO/2024/001"
                className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 outline-none"
              />
            </div>
          </div>

          {/* Product Lines */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Product Lines</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Product</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">Demand Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">Done Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={`border-b border-slate-200 dark:border-slate-800 ${
                        product.doneQty < product.demandQty ? "bg-yellow-50 dark:bg-yellow-950" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">{product.name}</td>
                      <td className="px-4 py-4 text-right text-sm text-slate-600 dark:text-gray-400">{product.demandQty}</td>
                      <td className="px-4 py-4 text-right">
                        <input
                          type="number"
                          value={product.doneQty}
                          onChange={(e) => handleProductUpdate(product.id, Number.parseInt(e.target.value) || 0)}
                          className="w-20 h-9 px-2 text-right border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-4">Status</h3>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">{status}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase">Created</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium mt-1">2024-11-20</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase">Modified</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium mt-1">2024-11-25</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase">Completion</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium mt-1">
                {products.filter((p) => p.doneQty === p.demandQty).length}/{products.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
