'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove a coluna user_id da tabela expenses
    await queryInterface.removeColumn('expenses', 'user_id');
  },

  async down(queryInterface, Sequelize) {
    // Adiciona novamente a coluna user_id caso queira reverter
    await queryInterface.addColumn('expenses', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
