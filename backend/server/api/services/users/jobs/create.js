const SQL = require('sql-template-strings');
const { queryOne, ErrorException, validation } = require('../../helpers');
const { missingValidation, numberValidation, isIncluded } = validation;

const create = async ({ name, budget = 75, budget_time = 'weekly' } = {}) => {
  missingValidation(name, 'Name', 400);

  numberValidation({
    operator: 'gt',
    name: 'Budget',
    validate: budget,
    compare: 0,
  });

  isIncluded({ validate: budget_time, valid: ['daily', 'weekly', 'monthly'], name: 'Budget Time' });

  const query = SQL`
    INSERT INTO "Users" ("name", "budget", "budget_time")
      VALUES(${name}, ${budget}, ${budget_time})
    RETURNING "name", "total_visits", "total_visited_restaurants", "spent", "budget", "budget_time";
    `;
  const res = await queryOne(query);
  return { data: res };
};

module.exports = create;
