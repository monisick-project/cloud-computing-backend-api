import { Sequelize } from "sequelize";


const db = new Sequelize('monisick', 'root', '', { 
    host: '/cloudsql/monisick-442015:asia-southeast2:monisick', 
    dialect: 'mysql',
    dialectOptions: {
        socketPath: '/cloudsql/monisick-442015:asia-southeast2:monisick', 
    },
    logging: false, 
});

export default db;
