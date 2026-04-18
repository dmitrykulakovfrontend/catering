import { getAllSiteSettings } from '@/lib/queries'
import SiteSettingsForm from '@/components/admin/SiteSettingsForm'

export default async function SettingsPage() {
  const settings = await getAllSiteSettings()

  // Build a simple object from the key-value pairs
  const settingsMap: Record<string, string> = {}
  for (const s of settings) {
    settingsMap[s.key] = s.value
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans text-2xl font-bold text-neutral-900">
          Настройки сайта
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Общие параметры, отображаемые на главной странице
        </p>
      </div>

      <SiteSettingsForm settings={settingsMap} />
    </div>
  )
}
