import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const WishlistItems = db.define('wishlistitems', {
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
    quantity: {
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
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'users',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
}, {
    freezeTableName: true
});

Users.hasMany(WishlistItems, {
    foreignKey: 'uuid',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
WishlistItems.belongsTo(Users, { foreignKey: 'uuid' });

export default WishlistItems;

//(async()=>{
  // await db.sync();
//})();