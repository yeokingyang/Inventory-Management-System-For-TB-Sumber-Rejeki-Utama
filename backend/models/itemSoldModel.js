import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const ItemsSold = db.define('items',{
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
    credit: {
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    totalCredit: {
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    quantitySold: {
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

Items.hasMany(ItemsSold);
ItemsSold.belongsTo(Items, {foreignKey:'iuid'});

export default ItemsSold;

//(async()=>{
  // await db.sync();
//})();