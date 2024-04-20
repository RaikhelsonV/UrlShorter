export default class IpModel {
    user_id;
    ip_address;
    created_at;

    constructor(user_id, ip_address) {
        this.user_id = user_id;
        this.ip_address = ip_address;
        this.created_at = new Date();
    }
}
