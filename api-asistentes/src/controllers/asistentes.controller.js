import sql from 'mssql';
import { getConnection } from '../database/connection.js';
import PDFDocument from 'pdfkit'; // 1. IMPORTAR PDFKit

// --- OBTENER ASISTENTES POR EVENTO ---
export const getAsistentesByEvento = async (req, res) => {
    try {
        const { eventoId } = req.params;

        const pool = await getConnection();
        const result = await pool.request()
            .input('eventoId', sql.Int, eventoId) 
            .execute('sp_GetAsistentesByEvento');
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- CREAR ASISTENTE ---
export const createAsistente = async (req, res) => {
    try {
        const { nombre, email, fotoPerfilDataUrl, eventoId } = req.body;
        
        if (!nombre || !email || !fotoPerfilDataUrl || !eventoId) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.NVarChar(255), nombre)
            .input('email', sql.NVarChar(255), email)
            .input('fotoPerfilDataUrl', sql.NVarChar(sql.MAX), fotoPerfilDataUrl)
            .input('eventoId', sql.Int, eventoId) 
            .execute('sp_CreateAsistente');

        res.status(201).json({ 
            message: "Asistente registrado exitosamente", 
            id: result.recordset[0].NuevoId
        });
    } catch (error) {
         if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }
        console.error('Error al crear asistente:', error); 
        res.status(500).json({ message: error.message });
    }
};

// --- ELIMINAR ASISTENTE ---
export const deleteAsistente = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        
        await pool.request()
            .input('id', sql.Int, id)
            .execute('sp_DeleteAsistente');

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- ACTUALIZAR ASISTENTE ---
export const updateAsistente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, fotoPerfilDataUrl } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.NVarChar(255), nombre)
            .input("email", sql.NVarChar(255), email)
            .input("fotoPerfilDataUrl", sql.NVarChar(sql.MAX), fotoPerfilDataUrl)
            .execute('sp_UpdateAsistente');
        res.json({ message: "Asistente actualizado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =======================================================
// --- FUNCIÓN NUEVA: GENERAR REPORTE PDF DE ASISTENTES ---
// =======================================================
export const getReporteAsistentes = async (req, res) => {
    try {
        const { eventoId } = req.params;

        const pool = await getConnection();
        // 2. Obtener los asistentes
        const result = await pool.request()
            .input('eventoId', sql.Int, eventoId)
            .execute('sp_GetAsistentesByEvento');
        
        const asistentes = result.recordset;

        // 3. Crear el documento PDF
        const doc = new PDFDocument({ margin: 30 });
        
        // Configurar cabeceras de respuesta para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Reporte_Evento_${eventoId}.pdf"`);
        
        // Enviar el PDF directamente al cliente
        doc.pipe(res); 

        // 4. Contenido del PDF
        doc.fontSize(20).text(`REPORTE DE ASISTENTES`, { align: 'center' });
        doc.fontSize(15).text(`Evento ID: ${eventoId}`, { align: 'center' });
        doc.moveDown();
        
        if (asistentes.length === 0) {
            doc.fontSize(12).text('No hay asistentes registrados para este evento.', { align: 'center' });
        } else {
            const tableTop = doc.y + 20;
            const itemX = 50;
            const emailX = 180;
            const idX = 450;
            
            // Cabecera de la tabla
            doc.fillColor('#000')
               .fontSize(10)
               .font('Helvetica-Bold')
               .text('NOMBRE', itemX, tableTop)
               .text('EMAIL', emailX, tableTop)
               .text('ID ASISTENTE', idX, tableTop);
            
            let y = tableTop + 15;
            
            asistentes.forEach((a, index) => {
                doc.font('Helvetica')
                   .fontSize(9)
                   .text(a.nombre.substring(0, 30), itemX, y)
                   .text(a.email.substring(0, 30), emailX, y)
                   .text(a.id, idX, y);
                y += 15;
                
                // Línea separadora
                if (index < asistentes.length - 1) {
                    doc.moveTo(itemX, y - 5).lineTo(550, y - 5).stroke('#cccccc');
                }
                
                // Salto de página
                if (y > 750) { 
                    doc.addPage(); 
                    y = 50; 
                }
            });
        }
        
        doc.end();

    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).json({ message: error.message });
    }
};