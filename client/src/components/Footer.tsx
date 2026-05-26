import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="flex-shrink-0 border-t border-slate-200 bg-white px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-slate-400">{t.footer.copyright}</p>
        <div className="flex items-center gap-3">
          {/* Guinea flag mini */}
          <div className="flex h-3 w-6 rounded-sm overflow-hidden flex-shrink-0">
            <div className="flex-1 bg-guinea-red" />
            <div className="flex-1 bg-guinea-gold" />
            <div className="flex-1 bg-guinea-green" />
          </div>
          <p className="text-xs text-slate-400">{t.footer.confidential}</p>
        </div>
      </div>
    </footer>
  )
}
