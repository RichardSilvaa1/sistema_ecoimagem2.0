'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Adiciona a nova coluna `paid_at` na tabela `Expenses`
     */
    await queryInterface.addColumn('Expenses', 'paid_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Reverte a mudança, removendo a coluna `paid_at`
     */
    await queryInterface.removeColumn('Expenses', 'paid_at');
  }
};