import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const ItemsPurchased = db.define('items',{
    iuid: {
        type:DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,    
        }
    },
    debit: {
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    totalDebit: {
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    quantityPurchased: {
        type:DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    }

},{
    freezeTableName:true
});

Items.hasMany(ItemsPurchased);
ItemsPurchased.belongsTo(Items, {foreignKey:'iuid'});

export default ItemsPurchased;

//(async()=>{
  // await db.sync();
//})();