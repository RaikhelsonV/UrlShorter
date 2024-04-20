export const queries = {
    INSERT_USER:
        'INSERT INTO users (user_id, name, password, created_at) VALUES ($1, $2, $3, $4)',
    SELECT_USER_BY_ID: 'SELECT * FROM users WHERE user_id = $1',
    SELECT_USER_BY_NAME: 'SELECT * FROM users WHERE name = $1::VARCHAR;',
    SELECT_ALL_USERS: 'SELECT * FROM users',
    SELECT_ALL_URLS: 'SELECT * FROM url_shorter',
    INSERT_URL:
        'INSERT INTO url_shorter (code, name, url, created_at, visits, user_id) VALUES ($1, $2, $3, $4, $5, $6)',
    SELECT_URL_BY_CODE: 'SELECT * FROM url_shorter WHERE code = $1',
    ADD_VISIT: 'UPDATE url_shorter SET visits = visits + 1 WHERE code = $1',
    SELECT_URLS_BY_USER: 'SELECT * FROM url_shorter WHERE user_id = $1',
};
