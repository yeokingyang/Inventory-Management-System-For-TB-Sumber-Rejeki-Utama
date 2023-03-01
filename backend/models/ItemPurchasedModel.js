import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Items from "./ItemModel.js";

const { DataTypes } = Sequelize;

const ItemsPurchased = db.define('itemsPurchased', {

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

}, {
    freezeTableName: true
});

Items.hasMany(ItemsPurchased);
ItemsPurchased.belongsTo(Items, { foreignKey: 'iuid' });

export default ItemsPurchased;

//(async () => {
   // console.log('Syncing database...');
//  await db.sync();
 //  console.log('Database synced!');
 // })();