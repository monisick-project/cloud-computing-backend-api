import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import MonitoringPeriod from "./MonitoringPeriodModel.js";

const { DataTypes } = Sequelize;

const Predicts = db.define(
    "predicts",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        foodName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mass: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        fat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        carbohydrates: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        protein: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            defaultValue: Sequelize.NOW, // Tanggal otomatis diisi dengan waktu sekarang
        },
        monitoringPeriodId: {
            type: DataTypes.INTEGER,
            references: {
                model: "monitoring_periods", // Nama tabel MonitoringPeriod
                key: "id",
            },
            allowNull: false,
            onDelete: "CASCADE" 
        },
    },
    {
        freezeTableName: true,
    }
);

MonitoringPeriod.hasMany(Predicts, { foreignKey: "monitoringPeriodId" });
Predicts.belongsTo(MonitoringPeriod, { foreignKey: "monitoringPeriodId" });

export default Predicts;
