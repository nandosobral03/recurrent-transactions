/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('categories', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        family:{
            type: 'VARCHAR(50)',
            notNull: true,
        },
        status:{
            type: 'VARCHAR(50)',
            notNull: true,
        }
    });
    pgm.addConstraint('categories', 'unique_family_category', 'UNIQUE(family,id)');
};

exports.down = pgm => {
    pgm.dropTable('categories');
};
