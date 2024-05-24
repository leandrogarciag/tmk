var Class2 = require("./public/js/Class2");

IPServidor = Class2.DeCrypt('5A6D526D416D5A6C5A78486D416D5A6A5A78486D416D57535A6D746D5A4E3D3D') //localhost
UsuarioServidor = Class2.DeCrypt('416D703242474D5141785A3242474C6B41784432416D4C6B416D56325A6D4C354177523D')  // por defecto
ContrasenaServidor = Class2.DeCrypt('417744325A775A315A6D566D41475A3341524833425145524151746D45474D54') // por defecto
BaseDatosServidor = Class2.DeCrypt('417744325A77706A41484C325A6D706C417844314577706A41784C335A7770304177523241514D54416D5A3341514D524178563D') //Especifico para cada proyecto
Puerto = 3306

//Variables de usuario active directorty
const url = 'LDAP://groupcos.com:389'
const baseDN = 'dc=groupcos,dc=com'
const username = ''
const password = ''

module.exports = {
  database: {
    host: IPServidor,
    port: Puerto,
    user: UsuarioServidor,
    password: ContrasenaServidor,
    database: BaseDatosServidor,
  },
  config: {
    url: url,
    baseDN: baseDN,
    username: username,
    password: password,
  },

  CONNECTLY_BUSSINES_ID: 'bfa3e62a-8a6c-4d09-b708-2d3a74e19ee1',
  CONNECTLY_API_KEY: 'NkIFZy5ubz4E8YivpBvXIp+Xh/r6RKGHumlOFqlYRU8=',

  // NO OLVIDAR VER EL ARCHIVO public/js/custom/configClient.js

};
