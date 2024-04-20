/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export function up(knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unique();
            table.string('name');
            table.string('surname');
            table.string('password');
            table.string('email').unique();
            table.string('role');
            table.timestamp('created_at', {useTz: false});
        })
        .createTable('url_shorter', function (table) {
            table.increments('id').primary();
            table.string('code').unique();
            table.string('name');
            table.string('url');
            table.timestamp('created_at', {useTz: false});
            table.integer('visits').defaultTo(0);
            table.timestamp('expire_at', {useTz: false});
            table.enum('type', ['permanent', 'temporary', 'one_time']);
            table.boolean('enabled');
            table.integer('user_id').references('user_id').inTable('users');
        })
        .createTable('user_ip_addresses', function (table) {
            table.increments('id').primary();
            table.integer('user_id').references('user_id').inTable('users');
            table.string('ip_address');
            table.timestamp('created_at', {useTz: false});
        });


};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('url_shorter').dropTable('user_ip_addresses').dropTable('users');
};
