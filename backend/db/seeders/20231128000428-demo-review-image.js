'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   ReviewImage.bulkCreate([
    {
      reviewId: 3,
      url: "image url",
    },
    {
      reviewId: 1,
      url: "image url",
    },
    {
      reviewId: 1,
      url: "image url",
    },
    {
      reviewId: 2,
      url: "image url",
    },
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
