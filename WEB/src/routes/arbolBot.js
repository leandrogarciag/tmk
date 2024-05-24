const router = require('express').Router();
const db = require('../database');
const path = require('path');
const { userInfo } = require('os');
const { database } = require('../keys');
const { isAgente } = require('../lib/auth');
const Class2 = require('../Class2');
const DB = database.database;
const fs = require('fs');
const { chmodSync } = require('fs-chmod');
const { isAdministrator } = require("../lib/auth");
var request = require('request');
require('colors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const tabla = "tbl_registros_tmk"


router.get("/arbolBot", isAdministrator, async (req, res) => {
  try {
    const sqlArbol = `SELECT * FROM ${DB}.${tabla}`;
    db.promise()
      .query(sqlArbol)
      .then(([resultArbol, fields]) => {

        for (let i = 0; i < resultArbol.length; i++) {
          resultArbol[i].EnCrypt = Class2.EnCrypt(`${resultArbol[i].PKBTREE_NCODIGO}`);
        }

        res.render("app/arbolBot", { title: "Árbol BOT", arbol: resultArbol });
      })
  } catch (error) {
    console.log("ERROR::", error);
  }

});


// Nueva ruta para generar el CSV
router.get('/download-csv', async (req, res) => {
  try {
    const sqlSelect = `SELECT * FROM ${DB}.tbl_registros_tmk`;
    const [registros] = await db.promise().query(sqlSelect);

    const csvWriter = createCsvWriter({
      path: 'tmk_registros.csv',
      header: [
        { id: 'fecha_registro', title: 'FECHA DE REGISTRO' },
        { id: 'fecha_modificacion', title: 'FECHA DE MODIFICACION' },
        { id: 'documento', title: 'DOCUMENTO' },
        { id: 'min', title: 'MIN' },
        { id: 'proveedor_donante', title: 'PROVEEDOR DONANTE' },
        { id: 'fecha_solicitud', title: 'FECHA SOLICITUD' },
        { id: 'fecha_portacion', title: 'FECHA PORTACION' },
        { id: 'estado', title: 'ESTADO' },
        { id: 'cod_distribuidor', title: 'COD. DISTRIBUIDOR' },
        { id: 'nombre_distribuidor', title: 'NOMBRE DISTRIBUIDOR' }
      ]
    });

    await csvWriter.writeRecords(registros);

    res.download('tmk_registros.csv', 'tmk_registros.csv', (err) => {
      if (err) {
        console.log('Error al descargar el archivo CSV:', err);
      } else {
        console.log('Archivo CSV descargado con éxito');
      }
    });
  } catch (error) {
    console.error('Error al generar el CSV:', error);
    res.status(500).send('Error al generar el CSV');
  }
});


module.exports = router;