import { Sequelize } from "sequelize";

const db_name = 'monisick_db'
const db_password = 'monisick4567'
const db_user = 'root'
const db_host = '34.101.178.142'

const db = new Sequelize(db_name, db_user, db_password,  {
  host : db_host,
    dialect: "mysql",
})

export default db;