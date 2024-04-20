import { UserRoles } from './userRoles.js';

export default class UserModel {
    user_id;
    name;
    surname;
    password;
    email;
    role;
    created_at;

    constructor(user_id, name, surname, password, email, role) {
        this.user_id = user_id;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.email = email;

        if (Object.values(UserRoles).includes(role)) {
            this.role = role;
        } else {
            throw new Error('Invalid role.');
        }
        this.created_at = new Date();
    }
}
