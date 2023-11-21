/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('game_result', (tb) => {
    tb.increments('id').primary();
    tb.timestamp('time', { useTz: true });
    tb.string('player0');
    tb.integer('player0_area');
    tb.string('player1');
    tb.integer('player2_area');
    tb.string('winner');
    tb.string('loser');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('game_result');
};
