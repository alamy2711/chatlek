import countries from '../constants/countries.json' with { type: 'json' };

export const isValidCountryCode = (code) => {
    if (!code) return false;
    return Object.hasOwn(countries, code.toLowerCase());
};

export const getCountryName = (code) => {
    return countries[code.toLowerCase()] || null;
};

export const countryCodes = Object.keys(countries);
