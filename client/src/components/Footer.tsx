import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#04080f] border-t border-white/5 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #CE1126 0%, #009460 100%)' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.4C17.25 22.15 21 17.25 21 12V7l-9-5z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg">
                Guinée<span style={{ color: '#FCD116' }}>Enquête</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Plateforme nationale d'investigation pour les forces de sécurité de la République de Guinée.
              Cartographiez, analysez et coordonnez vos enquêtes en temps réel.
            </p>
            {/* Guinea flag strip */}
            <div className="flex gap-1 mb-6">
              <div className="h-2 flex-1 rounded-l-full" style={{ background: '#CE1126' }} />
              <div className="h-2 flex-1" style={{ background: '#FCD116' }} />
              <div className="h-2 flex-1 rounded-r-full" style={{ background: '#009460' }} />
            </div>
            <p className="text-xs text-slate-500">
              Solution SaaS conçue pour la sécurité publique de la Guinée
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Navigation</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/product', label: 'Fonctionnalités' },
                { to: '/about', label: 'À Propos' },
                { to: '/#demo', label: 'Démo' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 fill-current flex-shrink-0" style={{ color: '#009460' }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Conakry, République de Guinée</span>
              </li>
              <li>
                <a href="mailto:golehlee@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" style={{ color: '#FCD116' }}>
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  golehlee@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/224629653636" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" style={{ color: '#25D366' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +224 629 653 636
                </a>
              </li>
              <li className="pt-1">
                <span className="text-white text-sm font-medium">Paikoun Nene</span>
                <br />
                <span className="text-xs text-slate-500">Fondateur & Directeur Produit</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2024 GuinéeEnquête. Tous droits réservés. Conçu pour la sécurité nationale de la République de Guinée.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>🇬🇳 République de Guinée</span>
            <span>•</span>
            <span>Conakry</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
