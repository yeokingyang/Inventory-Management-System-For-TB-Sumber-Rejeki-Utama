import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Items from "./ItemModel.js";

const { DataTypes } = Sequelize;

const IncomingItems = db.define('incomingItems', {

    iuid: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        },
        references: {
            model: Items,
            key: 'iuid'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    debit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    totalDebit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    quantityPurchased: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    quantification: {
        type:DataTypes.STRING,
        allowNull: true
    },
        explanation: {
        type:DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

Items.hasMany(IncomingItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
IncomingItems.belongsTo(Items, {
    foreignKey: 'iuid',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

export default IncomingItems;

//(async () => {
   // console.log('Syncing database...');
//  await db.sync();
 //  console.log('Database synced!');
 // })();