import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Items from "./ItemModel.js";

const { DataTypes } = Sequelize;

const OutgoingItems = db.define('outgoingItems', {

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
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    credit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    totalCredit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    quantitySold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    quantification: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    explanation: {
        type:DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true,
});

Items.hasMany(OutgoingItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
OutgoingItems.belongsTo(Items, { 
    foreignKey: 'iuid', 
    onDelete: 'CASCADE',
     onUpdate: 'CASCADE' });

export default OutgoingItems;

//(async () => {
   // console.log('Syncing database...');
 //await db.sync();
 //  console.log('Database synced!');
//})();