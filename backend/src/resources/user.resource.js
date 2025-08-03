import { getCountryName } from '../utils/countriesUtils.js';

export const userResource = (user) => ({
    id: user._id,
    fullname: user.fullName,
    email: user.email,
    avatar: user.avatar,
    gender: user.gender,
    age: user.age,
    country: {
        code: user.country,
        name: getCountryName(user.country),
    },
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
