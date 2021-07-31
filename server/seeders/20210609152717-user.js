'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('users', [
      {
        fullName: 'Admin Dumbways',
        username: 'admin',
        email: 'admin@domain.com',
        password: '1234',
        bio: 'Lorem ipsum...',
        createdAt: '2021-06-08 21:03:52',
        updatedAt: '2021-06-08 21:03:52'
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
