import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  /** Set to true for full-height pages (e.g. canvas) that manage their own scroll */
  fullHeight?: boolean
  /** Hide footer for canvas/full-screen pages */
  hideFooter?: boolean
}

export default function Layout({ children, fullHeight = false, hideFooter = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`flex ${fullHeight ? 'h-screen' : 'min-h-screen'} bg-slate-50`}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page content */}
        <main className={`flex-1 ${fullHeight ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {children}
        </main>

        {/* Footer */}
        {!hideFooter && <Footer />}
      </div>
    </div>
  )
}
