import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/product', label: 'Produit' },
  { to: '/about', label: 'À Propos' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'Guide' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060b14]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #CE1126 0%, #009460 100%)' }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.4C17.25 22.15 21 17.25 21 12V7l-9-5z"/>
              <path d="M10 17l-3-3 1.4-1.4 1.6 1.6 4.6-4.6L16 11l-6 6z" fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Guinée<span style={{ color: '#FCD116' }}>Enquête</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
            Connexion
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}
          >
            Démo Gratuite
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-slate-400 hover:text-white">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            {open
              ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              : <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#060b14] border-t border-white/5 px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-3 rounded-lg text-sm font-semibold text-white text-center transition-all"
            style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}
          >
            Démo Gratuite
          </Link>
        </div>
      )}
    </nav>
  )
}
