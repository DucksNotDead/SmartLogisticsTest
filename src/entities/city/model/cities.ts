export type City = {
  name: string
}

/** Mock dictionary for load/unload city selects (aligned with MSW seed). */
export const CITIES = [
  { name: 'Москва' },
  { name: 'Казань' },
  { name: 'Самара' },
  { name: 'Екатеринбург' },
  { name: 'Новосибирск' },
  { name: 'Санкт-Петербург' },
  { name: 'Нижний Новгород' },
  { name: 'Уфа' },
  { name: 'Пермь' },
  { name: 'Омск' },
] as const satisfies readonly City[]

export type CityName = (typeof CITIES)[number]['name']

const CITY_NAMES = new Set<string>(CITIES.map((city) => city.name))

export function getCities(): readonly City[] {
  return CITIES
}

export function isKnownCity(name: string): boolean {
  return CITY_NAMES.has(name)
}
