const cron = require('node-cron');
const db = require('../database'); // Asegúrate de que la ruta sea correcta

async function fetchDataAndUpdateDB() {
    try {
        const fetch = (await import('node-fetch')).default;
        const sqlSelect = `SELECT documento, min FROM tbl_registros_tmk WHERE estado != "Exitoso" or estado is null`;
        const [registros] = await db.promise().query(sqlSelect);
        for (const registro of registros) {
            const { documento, min } = registro;

            const response = await fetch('http://172.70.7.80:5000/consulta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documento, min }),
            });

            if (response.ok) {
                const data = await response.json();
                const [
                    id_solicitud, nip, tipo_doc, nombre, tel_fijo, proveedor_donante,
                    fecha_solicitud, fecha_portacion, estado, descripcion_estado,
                    cod_distribuidor, nombre_distribuidor
                ] = data.data;

                const formattedFechaSolicitud = formatDatetime(fecha_solicitud);
                const formattedFechaPortacion = formatDate(fecha_portacion);

                const sqlUpdate = `
          UPDATE tbl_registros_tmk 
          SET 
            id_solicitud = ?, nip = ?, tipo_doc = ?, nombre = ?, tel_fijo = ?, 
            proveedor_donante = ?, fecha_solicitud = ?, fecha_portacion = ?, 
            estado = ?, descripcion_estado = ?, cod_distribuidor = ?, nombre_distribuidor = ?
          WHERE documento = ? AND min = ?`;

                await db.promise().query(sqlUpdate, [
                    id_solicitud, nip, tipo_doc, nombre, tel_fijo, proveedor_donante,
                    formattedFechaSolicitud, formattedFechaPortacion, estado, descripcion_estado,
                    cod_distribuidor, nombre_distribuidor, documento, min
                ]);

                console.log(`Updated record: documento = ${documento}, min = ${min}`);
            } else {
                console.error(`Error fetching data for documento: ${documento}, min: ${min}`);
            }
        }
    } catch (error) {
        console.error('Error updating database:', error);
    }
}


function formatDatetime(datetime) {
    const [date, time, period] = datetime.split(' ');
    const [day, month, year] = date.split('/');
    let [hours, minutes] = time.split(':');

    if (period === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    } else if (period === 'AM' && hours === '12') {
        hours = '00';
    }

    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
}

// Función para convertir la fecha al formato MySQL
function formatDate(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}
// Programar la tarea para que se ejecute cada 30 segundos
cron.schedule('*/30 * * * * *', () => {
    console.log('Running cron job');
    fetchDataAndUpdateDB();
});
