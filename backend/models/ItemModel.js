import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Items = db.define('items', {
    iuid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
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
    debit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    credit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quantityReceived: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    quantityOnHand: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
        type: DataTypes.STRING,
        allowNull: true,
    },
    explanation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        references: {
            model: 'users', // Update the reference to the User model
            key: 'uuid' // Update the key to 'uuid' in the User model
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(Items);
Items.belongsTo(Users, { foreignKey: 'userId' });

export default Items;

(async()=>{
   await db.sync();
})();