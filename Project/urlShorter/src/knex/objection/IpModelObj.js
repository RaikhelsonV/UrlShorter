import {Model} from 'objection';
import UserModelObj from "./UserModelObj.js";

class IpModelObj extends Model {
    static get tableName() {
        return 'user_ip_addresses';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'ip_address'],

            properties: {
                id: {type: 'integer'},
                user_id: {type: 'integer'},
                ip_address: {type: 'string'},
                created_at: {type: 'string', format: 'date-time'},
            }
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: UserModelObj,
                join: {
                    from: 'user_ip_addresses.user_id',
                    to: 'users.user_id'
                }
            }
        };
    }
}

export default IpModelObj;