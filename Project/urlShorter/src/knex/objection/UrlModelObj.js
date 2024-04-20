import {Model} from "objection";
import UserModelObj from "./UserModelObj.js";

class UrlModelObj extends Model {
    static get tableName() {
        return 'url_shorter';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['code', 'name', 'url', 'created_at', 'expire_at', 'type', 'enabled'],
            properties: {
                id: {type: 'integer'},
                code: {type: 'string', minLength: 10, maxLength: 50},
                name: {type: 'string', minLength: 1, maxLength: 50},
                url: {type: 'string'},
                created_at: {type: 'string', format: 'date-time'},
                visits: {type: 'integer'},
                expire_at: { type: ['string', 'null']},
                type: { type: 'string', enum: ['permanent', 'temporary', 'one_time'] },
                enabled: { type: 'boolean' },
                user_id: {type: 'integer'},
            }
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: UserModelObj,
                join: {
                    from: 'url_shorter.user_id',
                    to: 'users.user_id'
                }
            }
        };
    }
}

export default UrlModelObj;