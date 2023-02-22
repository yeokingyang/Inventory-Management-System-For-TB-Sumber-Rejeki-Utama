import { Sequelize } from "sequelize";

const db = new Sequelize('tbsru_db','root','',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;