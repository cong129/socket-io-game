/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('game_result', (tb) => {
    tb.dropColumn('player2_area');
    tb.string('player1_area');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('game_result', (tb) => {
    tb.dropColumn('player1_area');
    tb.string('player2_area');
  });
};
