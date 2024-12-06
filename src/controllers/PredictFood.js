import axios from "axios";
import Predicts from "../models/PredictFoodModel.js";
import MonitoringPeriod from "../models/MonitoringPeriodModel.js";
import { Op } from "sequelize";
import fs from 'fs';


// Endpoint untuk scan makanan dan mendapatkan prediksi
export const Prediction = async (req, res) => {
    const imagePath = req.file.path; // Path sementara gambar yang diunggah
    try {
      // Baca file dan konversi ke base64
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
  
      // Kirim gambar ke API ML dalam bentuk base64
      const response = await axios.post('https://monisick-app-ml-1035188713587.asia-southeast2.run.app/predict/', { image: imageBase64 });
      const { mass, fats, carbohydrates, protein } = response.data;
  
      // Hapus file sementara
      fs.unlinkSync(imagePath);
  
      // Kirim hasil ke frontend
      res.status(200).json({
        mass,
        fats,
        carbohydrates,
        protein,
        imageBase64: `data:image/jpeg;base64,${imageBase64}`, // Format untuk ditampilkan di HTML <img>
      });
    } catch (error) {
      console.error(error);
  
      // Hapus file jika ada error
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  
      res.status(500).json({ message: 'Failed to process the image' });
    }
};

// Endpoint untuk menyimpan hasil prediksi
export const savePrediction = async (req, res) => {
    const { foodName, mass, fat, carbohydrates, protein } = req.body;
    try {
        // Cari semua monitoring period yang aktif
        const activeMonitoringPeriods = await MonitoringPeriod.findAll({
            where: {
                end_date: { [Op.gt]: new Date() }, // Monitoring period belum berakhir
                status: "active", // Status monitoring period aktif
            },
        });

        // Jika tidak ada monitoring period yang aktif, kembalikan pesan error
        if (activeMonitoringPeriods.length === 0) {
            return res
                .status(404)
                .json({ msg: "No active monitoring periods found" });
        }

        // Simpan hasil prediksi untuk setiap monitoring period yang aktif
        const predictions = [];
        for (let period of activeMonitoringPeriods) {
            const prediction = await Predicts.create({
                foodName,
                mass,
                fat,
                carbohydrates,
                protein,
                date: new Date(), // Tanggal otomatis menggunakan waktu server
                monitoringPeriodId: period.id, // Hubungkan ke monitoring period yang aktif
            });
            predictions.push(prediction);
        }

        res.status(201).json({
            msg: "Predictions saved successfully"
        });
    } catch (error) {
        console.error("Error saving predictions:", error.message);
        res.status(500).json({ msg: "Server error while saving predictions" });
    }
};


// Mendapat data makanan berdasarkan MonitoringPeriodId
export const getPredictFood = async (req, res) => {
    const { monitoringPeriodId } = req.params;

    // Validasi monitoringPeriodId
    if (!monitoringPeriodId) {
        return res.status(400).json({ msg: "MonitoringPeriodId is required" });
    }

    try {
        // Ambil data prediksi makanan berdasarkan MonitoringPeriodId
        const predictFood = await Predicts.findAll({
            where: { monitoringPeriodId },
            attributes: [
                "foodName",        
                "mass",           
                "fat",            
                "carbohydrates",   
                "protein",         
                "date",           
            ],
            order: [["date", "ASC"], ["foodName", "ASC"]], 
        });

        // Jika tidak ada data ditemukan untuk monitoring period tersebut
        if (predictFood.length === 0) {
            return res.status(404).json({ msg: "No food data found for the given monitoring period" });
        }
            
        res.status(200).json({
            msg: "Food data retrieved successfully",
            data: predictFood,
        });
    } catch (error) {
        console.error("Error while fetching food report:", error.message);
        res.status(500).json({ msg: "Server error while fetching food report" });
    }
};
