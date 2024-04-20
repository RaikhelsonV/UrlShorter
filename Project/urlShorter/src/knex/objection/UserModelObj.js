import {Model} from 'objection';
import UrlModelObj from "./UrlModelObj.js";

class UserModelObj extends Model {
    static get tableName() {
        return 'users';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'name','surname', 'password', 'email'],
            properties: {
                id: {type: 'integer'},
                user_id: {type: 'integer'},
                name: {type: 'string'},
                surname: {type: 'string'},
                password: {type: 'string'},
                email: {type: 'string'},
                role: {type: 'string'},
                created_at: {type: 'string', format: 'date-time'}
            }
        };
    }

    static get relationMappings() {
        return {
            links: {
                relation: Model.HasManyRelation,
                modelClass: UrlModelObj,
                join: {
                    from: 'users.user_id',
                    to: 'url_shorter.user_id'
                }
            }
        };
    }
}

export default UserModelObj;
