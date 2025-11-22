"use client"

import { Box, AlertTriangle, Truck, Send, Plus, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DashboardProps {
  onNavigate: (view: string) => void
}

const chartData = [
  { week: "W1", moves: 240 },
  { week: "W2", moves: 340 },
  { week: "W3", moves: 200 },
  { week: "W4", moves: 500 },
  { week: "W5", moves: 420 },
]

export function Dashboard({ onNavigate }: DashboardProps) {
  const kpis = [
    {
      title: "Total Products",
      value: "1,247",
      icon: Box,
      color: "bg-blue-100 text-blue-600",
      trend: "+12%",
    },
    {
      title: "Low Stock Alerts",
      value: "24",
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      trend: "-5%",
    },
    {
      title: "Incoming Receipts",
      value: "4",
      subtext: "1 Late",
      icon: Truck,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Outgoing Deliveries",
      value: "4",
      subtext: "In Progress",
      icon: Send,
      color: "bg-emerald-100 text-emerald-600",
    },
  ]

  const quickActions = [
    { label: "New Receipt", action: () => onNavigate("operations-list") },
    { label: "New Delivery", action: () => onNavigate("operations-list") },
    { label: "Adjust Stock", action: () => onNavigate("products") },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">Good Morning</h1>
        <p className="text-slate-600 mt-2">Welcome to your inventory dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div
              key={idx}
              className={`${kpi.color} bg-opacity-10 rounded-lg p-6 border border-current border-opacity-20 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon size={24} />
                </div>
                {kpi.trend && <span className="text-sm font-semibold text-emerald-600">{kpi.trend}</span>}
              </div>
              <p className="text-sm font-medium text-slate-600">{kpi.title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{kpi.value}</p>
              {kpi.subtext && <p className="text-xs text-slate-500 mt-2">{kpi.subtext}</p>}
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.action}
              className="flex-1 h-11 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Stock Moves per Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
              <Bar dataKey="moves" fill="#0d9488" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: "Receipt Validated", time: "2 hours ago", icon: Truck },
              { action: "Stock Adjusted", time: "4 hours ago", icon: Box },
              { action: "Delivery Scheduled", time: "6 hours ago", icon: Send },
            ].map((activity, idx) => {
              const Icon = activity.icon
              return (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-200 last:border-0">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Icon size={16} className="text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
