/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('recurrent', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        description: {
            type: 'VARCHAR(200)',
            notNull: true,
        },
        amount: {
            type: 'INTEGER',
            notNull: true,
        },
        user: {
            type: 'VARCHAR(200)',
            notNull: true,
        },
        family: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        category: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        recurrence:{
            type: 'VARCHAR(50)',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        send_date:{
            type: 'TIMESTAMP',
            notNull: true,
        },
        type: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    });
    pgm.addConstraint('recurrent', 'fk_recurrent.family_categories.id', 'FOREIGN KEY(family, category) REFERENCES categories(family, id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('recurrent');
};
