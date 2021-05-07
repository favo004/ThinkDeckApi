import bcrypt from 'bcrypt';

export const encrpytPassword = (password) => {
    return bcrypt.hash(password, 10)
}

