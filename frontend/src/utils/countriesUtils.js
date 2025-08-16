import countries from '../constants/countries.json' with { type: 'json' };

export const isValidCountryCode = (code) => {
    if (!code) return false;
    return Object.hasOwn(countries, code.toLowerCase());
};

export const getCountryName = (code) => {
    return countries[code.toLowerCase()] || null;
};

export const countryCodes = Object.keys(countries);
export const countryNames = Object.values(countries);

export const sortedCountries = Object.entries(countries).sort((a, b) =>
    a[1].localeCompare(b[1]),
);
