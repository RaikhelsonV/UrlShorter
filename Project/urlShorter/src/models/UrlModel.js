import {UrlType, Enabled} from './urlConstants.js';

export default class Url {
    code;
    name;
    url;
    expire_at;
    type;
    enabled;
    user;

    constructor(code, name, url, expire_at, type, enabled, user) {
        this.code = code;
        this.name = name;
        this.url = url;
        this.created_at = new Date();
        this.expire_at = expire_at;
        this.visits = 0;

        if (!Object.values(UrlType).includes(type)) {
            throw new Error('Invalid type.');
        }
        this.type = type;

        if (!Object.values(Enabled).includes(enabled)) {
            throw new Error('Invalid enabled value.');
        }
        this.enabled = enabled;

        this.user = user;
    }
}
