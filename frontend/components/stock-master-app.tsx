"use client"

import { useState } from "react"
import { TopNavigation } from "./top-navigation"
import { AuthScreen } from "./views/auth-screen"
import { Dashboard } from "./views/dashboard"
import { OperationsDashboard } from "./views/operations-dashboard"
import { OperationsListView } from "./views/operations-list-view"
import { OperationDetailView } from "./views/operation-detail-view"
import { ProductManagement } from "./views/product-management"
import { MoveHistory } from "./views/move-history"
import { Settings } from "./views/settings"

export function StockMasterApp() {
  const [currentView, setCurrentView] = useState<string>("auth")
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [selectedOperationId, setSelectedOperationId] = useState<string>("WH/IN/001")

  const handleLogin = (email: string) => {
    setCurrentUser(email.split("@")[0])
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("auth")
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  const renderView = () => {
    switch (currentView) {
      case "auth":
        return <AuthScreen onLogin={handleLogin} />
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />
      case "operations":
        return <OperationsDashboard onNavigate={handleNavigate} />
      case "operations-list":
        return <OperationsListView onNavigate={handleNavigate} onSelectOperation={setSelectedOperationId} />
      case "detail":
        return <OperationDetailView operationId={selectedOperationId} onNavigate={handleNavigate} />
      case "products":
        return <ProductManagement onNavigate={handleNavigate} />
      case "move-history":
        return <MoveHistory onNavigate={handleNavigate} />
      case "settings":
        return <Settings onNavigate={handleNavigate} />
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  if (!currentUser) {
    return renderView()
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Top Navigation */}
      <TopNavigation
        currentView={currentView}
        userName={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{renderView()}</main>
    </div>
  )
}
