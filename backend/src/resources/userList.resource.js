import { getCountryName } from '../utils/countriesUtils.js';

export const userListResource = (user) => ({
    id: user._id,
    fullName: user.fullName,
    avatar: user.avatar,
    gender: user.gender,
    age: user.age,
    country: {
        code: user.country,
        name: getCountryName(user.country),
    },
});

