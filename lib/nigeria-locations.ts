export type CitySuggestion = {
  city: string;
  state: string;
};

const locations = [
  { state: "Abia", cities: ["Aba", "Umuahia"] },
  { state: "Adamawa", cities: ["Mubi", "Yola"] },
  { state: "Akwa Ibom", cities: ["Eket", "Ikot Ekpene", "Uyo"] },
  { state: "Anambra", cities: ["Awka", "Nnewi", "Onitsha"] },
  { state: "Bauchi", cities: ["Azare", "Bauchi"] },
  { state: "Bayelsa", cities: ["Yenagoa"] },
  { state: "Benue", cities: ["Gboko", "Makurdi", "Otukpo"] },
  { state: "Borno", cities: ["Biu", "Maiduguri"] },
  { state: "Cross River", cities: ["Calabar", "Ikom"] },
  { state: "Delta", cities: ["Asaba", "Sapele", "Ughelli", "Warri"] },
  { state: "Ebonyi", cities: ["Abakaliki"] },
  { state: "Edo", cities: ["Benin City", "Ekpoma"] },
  { state: "Ekiti", cities: ["Ado Ekiti", "Ikere"] },
  { state: "Enugu", cities: ["Enugu", "Nsukka"] },
  { state: "Federal Capital Territory", cities: ["Abuja", "Gwagwalada"] },
  { state: "Gombe", cities: ["Gombe", "Kaltungo"] },
  { state: "Imo", cities: ["Okigwe", "Orlu", "Owerri"] },
  { state: "Jigawa", cities: ["Dutse", "Hadejia"] },
  { state: "Kaduna", cities: ["Kaduna", "Kafanchan", "Zaria"] },
  { state: "Kano", cities: ["Kano", "Wudil"] },
  { state: "Katsina", cities: ["Daura", "Funtua", "Katsina"] },
  { state: "Kebbi", cities: ["Argungu", "Birnin Kebbi"] },
  { state: "Kogi", cities: ["Anyigba", "Kabba", "Lokoja"] },
  { state: "Kwara", cities: ["Ilorin", "Offa"] },
  { state: "Lagos", cities: ["Badagry", "Epe", "Ikeja", "Lagos", "Lekki"] },
  { state: "Nasarawa", cities: ["Karu", "Keffi", "Lafia"] },
  { state: "Niger", cities: ["Bida", "Minna", "Suleja"] },
  { state: "Ogun", cities: ["Abeokuta", "Ijebu Ode", "Ota", "Sagamu"] },
  { state: "Ondo", cities: ["Akure", "Ondo", "Owo"] },
  { state: "Osun", cities: ["Ile-Ife", "Ilesa", "Osogbo"] },
  { state: "Oyo", cities: ["Ibadan", "Ogbomoso", "Oyo"] },
  { state: "Plateau", cities: ["Jos", "Pankshin"] },
  { state: "Rivers", cities: ["Bonny", "Port Harcourt"] },
  { state: "Sokoto", cities: ["Sokoto"] },
  { state: "Taraba", cities: ["Jalingo", "Wukari"] },
  { state: "Yobe", cities: ["Damaturu", "Potiskum"] },
  { state: "Zamfara", cities: ["Gusau", "Kaura Namoda"] },
] as const;

export const nigeriaStates = locations.map(({ state }) => state);

export const nigeriaCities: CitySuggestion[] = locations.flatMap(
  ({ state, cities }) => cities.map((city) => ({ city, state })),
);

export function filterNigeriaStates(query: string, limit = 7) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];

  return nigeriaStates
    .filter((state) => state.toLocaleLowerCase().includes(normalizedQuery))
    .slice(0, limit);
}

export function filterNigeriaCities(
  query: string,
  selectedState: string,
  limit = 7,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];

  const normalizedState = selectedState.trim().toLocaleLowerCase();
  return nigeriaCities
    .filter(
      ({ city, state }) =>
        city.toLocaleLowerCase().includes(normalizedQuery) &&
        (!normalizedState || state.toLocaleLowerCase() === normalizedState),
    )
    .slice(0, limit);
}
