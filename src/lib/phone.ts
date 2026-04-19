import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js'

const DEFAULT_COUNTRY: CountryCode = 'RU'

function normalize(raw: string): string {
  const input = raw.trim()
  if (/^\+8\d{10}$/.test(input)) return '+7' + input.slice(2)
  return input
}

export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return ''
  const parsed = parsePhoneNumberFromString(normalize(raw), DEFAULT_COUNTRY)
  if (!parsed || !parsed.isValid()) return raw
  if (parsed.country === 'RU') {
    const n = parsed.nationalNumber
    if (n.length === 10) {
      return `+7 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`
    }
  }
  return parsed.formatInternational()
}

export function phoneTelHref(raw: string | null | undefined): string {
  if (!raw) return ''
  const parsed = parsePhoneNumberFromString(normalize(raw), DEFAULT_COUNTRY)
  const digits = parsed?.isValid() ? parsed.number : raw.replace(/[^\d+]/g, '')
  return `tel:${digits}`
}
