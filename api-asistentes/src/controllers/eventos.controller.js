import sql from 'mssql';
import { getConnection } from '../database/connection.js';

// --- OBTENER EVENTOS ---
export const getEventos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetEventos');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- OBTENER EVENTO POR ID ---
export const getEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input("id", sql.Int, id) // CAMBIO: Ahora es sql.Int
            .execute('sp_GetEventoById');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- CREAR EVENTO ---
export const createEvento = async (req, res) => {
    try {
        // Recibimos latitud y longitud del celular
        const { nombre, lugar, fecha, latitud, longitud } = req.body;
        
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.NVarChar(255), nombre)
            .input('lugar', sql.NVarChar(255), lugar)
            .input('fecha', sql.Date, fecha)
            // Agregamos los inputs de coordenadas (pueden ser null si no se envían)
            .input('latitud', sql.Float, latitud || null)
            .input('longitud', sql.Float, longitud || null)
            .execute('sp_CreateEvento');

        res.status(201).json({ 
            message: "Evento creado con ubicación", 
            id: result.recordset[0].NuevoId 
        });
    } catch (error) {
        console.error('Error al crear evento:', error); 
        res.status(500).json({ message: error.message });
    }
};
// --- ELIMINAR EVENTO ---
export const deleteEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        
        await pool.request()
            .input('id', sql.Int, id)
            .execute('sp_DeleteEvento');

        res.sendStatus(204); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, lugar, fecha, latitud, longitud } = req.body;
        
        const pool = await getConnection();
        await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.NVarChar(255), nombre)
            .input("lugar", sql.NVarChar(255), lugar)
            .input("fecha", sql.Date, fecha)
            .input('latitud', sql.Float, latitud || null)
            .input('longitud', sql.Float, longitud || null)
            .execute('sp_UpdateEvento');
            
        res.json({ message: "Evento actualizado con ubicación" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};