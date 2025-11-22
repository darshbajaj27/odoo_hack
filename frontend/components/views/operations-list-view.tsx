"use client"

import { Search, Filter, Plus, ChevronRight } from "lucide-react"
import { useState } from "react"

interface OperationsListViewProps {
  onNavigate: (view: string) => void
  onSelectOperation: (id: string) => void
}

const mockOperations = [
  {
    id: "WH/IN/001",
    ref: "WH/IN/001",
    vendor: "Steel Suppliers Inc",
    date: "2024-11-25",
    source: "PO/2024/001",
    status: "Ready",
  },
  {
    id: "WH/IN/002",
    ref: "WH/IN/002",
    vendor: "Azure Interior",
    date: "2024-11-26",
    source: "PO/2024/002",
    status: "Waiting",
  },
  {
    id: "WH/OUT/001",
    ref: "WH/OUT/001",
    vendor: "Customer A",
    date: "2024-11-24",
    source: "SO/2024/001",
    status: "Done",
  },
  {
    id: "WH/OUT/002",
    ref: "WH/OUT/002",
    vendor: "Customer B",
    date: "2024-11-27",
    source: "SO/2024/002",
    status: "Draft",
  },
  {
    id: "WH/IN/003",
    ref: "WH/IN/003",
    vendor: "Metals Co",
    date: "2024-11-28",
    source: "PO/2024/003",
    status: "Cancelled",
  },
]

const statusConfig = {
  Draft: { bg: "bg-gray-100", text: "text-gray-700" },
  Waiting: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Ready: { bg: "bg-blue-100", text: "text-blue-700" },
  Done: { bg: "bg-green-100", text: "text-green-700" },
  Cancelled: { bg: "bg-red-100", text: "text-red-700" },
}

export function OperationsListView({ onNavigate, onSelectOperation }: OperationsListViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filtered = mockOperations.filter((op) => {
    const matchesSearch =
      op.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || op.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleRowClick = (id: string) => {
    onSelectOperation(id)
    onNavigate("detail")
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Operations</h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">Manage receipts and deliveries</p>
        </div>
        <button className="h-11 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 px-6">
          <Plus size={20} />
          Create
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search Reference, Vendor..."
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

      {/* Status Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            statusFilter === null ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          All
        </button>
        {Object.keys(statusConfig).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === status ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Reference</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Vendor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Source Doc</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((op, idx) => {
                const config = statusConfig[op.status as keyof typeof statusConfig] || statusConfig.Draft
                return (
                  <tr
                    key={idx}
                    onClick={() => handleRowClick(op.id)}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{op.ref}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">{op.vendor}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">{op.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">{op.source}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <ChevronRight size={18} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filtered.map((op, idx) => {
            const config = statusConfig[op.status as keyof typeof statusConfig] || statusConfig.Draft
            return (
              <div
                key={idx}
                onClick={() => handleRowClick(op.id)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{op.ref}</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">{op.vendor}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                    {op.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400">
                  <span>{op.date}</span>
                  <span>{op.source}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
