document.addEventListener("DOMContentLoaded", async () => {

  const CONFIG_DATATABLE = {
    responsive: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "All"],
    ],
    language: {
      lengthMenu: 'Mostrar _MENU_ registros',
      zeroRecords: 'No se encontraron resultados',
      info: 'Registros en total - _TOTAL_',
      infoEmpty: '0 registros',
      infoFiltered: '(filtrado de un total de _MAX_ registros)',
      sSearch: 'Busqueda rapida:',
      oPaginate: {
        sFirst: 'Primero',
        sLast: 'Último',
        sNext: 'Siguiente',
        sPrevious: 'Anterior',
      },
      sProcessing: 'Procesando...',
    }
  };

  // Inicializar DataTable vacío
  const table = $("#page-length-option3").DataTable(CONFIG_DATATABLE);

  // Obtener los datos de la tabla `tbl_registros_tmk`
  async function fetchRegistrosTMK() {
    try {
      const response = await fetch('https://democrmportadostmk.rpagroupcos.com/reportes/getRegistrosTMK');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Registros:', data);
      return data;  // Devuelve los datos obtenidos
    } catch (error) {
      console.error('Error al obtener registros:', error);
      return [];  // En caso de error, devuelve un array vacío
    }
  }

  // Obtener los datos y llenar la tabla
  const registros = await fetchRegistrosTMK();
  table.clear().rows.add(registros).draw();

});
