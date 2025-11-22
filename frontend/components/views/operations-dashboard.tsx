"use client"

import { Truck, Send, Zap, Plus } from "lucide-react"

interface OperationsDashboardProps {
  onNavigate: (view: string) => void
}

export function OperationsDashboard({ onNavigate }: OperationsDashboardProps) {
  const operations = [
    {
      id: "receipts",
      title: "Receipts",
      icon: Truck,
      count: 4,
      late: 1,
      color: "bg-amber-100 text-amber-600",
    },
    {
      id: "deliveries",
      title: "Delivery Orders",
      icon: Send,
      count: 4,
      late: 0,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      id: "manufacturing",
      title: "Manufacturing",
      icon: Zap,
      count: 2,
      late: 0,
      color: "bg-blue-100 text-blue-600",
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
          Operations Dashboard
        </h1>
        <p className="text-slate-600 mt-2">Manage incoming receipts, deliveries, and manufacturing orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {operations.map((op) => {
          const Icon = op.icon
          return (
            <div
              key={op.id}
              className={`${op.color} bg-opacity-10 rounded-lg p-8 border border-current border-opacity-20 shadow-sm hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-lg ${op.color}`}>
                  <Icon size={28} />
                </div>
                <button
                  onClick={() => onNavigate("operations-list")}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                  title={`Add new ${op.title.toLowerCase()}`}
                >
                  <Plus size={20} />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-4">{op.title}</h3>

              <div className="space-y-3">
                <button
                  onClick={() => onNavigate("operations-list")}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
                >
                  {op.count} To Process
                </button>
                {op.late > 0 && <p className="text-sm text-red-600 font-medium">{op.late} Late</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
