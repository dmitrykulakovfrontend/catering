export function pluralItems(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'блюдо'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'блюда'
  return 'блюд'
}

export function aggregateWeights(
  items: { weight: number; weightUnit: string; quantity: number }[],
) {
  const sums: Record<string, number> = {}
  for (const it of items) {
    if (!it.weight || it.weight <= 0) continue
    const total = it.weight * it.quantity
    let unit = it.weightUnit || 'г'
    let val = total
    if (unit === 'кг') { unit = 'г'; val = total * 1000 }
    if (unit === 'л') { unit = 'мл'; val = total * 1000 }
    sums[unit] = (sums[unit] || 0) + val
  }
  return sums
}

export function perPerson(sums: Record<string, number>, persons: number) {
  if (persons <= 0) return sums
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(sums)) out[k] = v / persons
  return out
}

export function formatWeightMap(sums: Record<string, number>): string {
  const order = ['г', 'мл', 'шт']
  const parts: string[] = []
  for (const unit of order) {
    const v = sums[unit]
    if (!v) continue
    if (unit === 'г' && v >= 1000) {
      parts.push(`${(v / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} кг`)
    } else if (unit === 'мл' && v >= 1000) {
      parts.push(`${(v / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} л`)
    } else if (unit === 'шт') {
      parts.push(`${Math.round(v).toLocaleString('ru-RU')} шт`)
    } else {
      parts.push(`${Math.round(v).toLocaleString('ru-RU')} ${unit}`)
    }
  }
  for (const [k, v] of Object.entries(sums)) {
    if (order.includes(k) || !v) continue
    parts.push(`${Math.round(v).toLocaleString('ru-RU')} ${k}`)
  }
  return parts.join(' · ')
}
