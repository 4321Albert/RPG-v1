/*:
 * @plugindesc Verifica conexión con Google Apps Script desde RPG Maker MV (URL fija en el código).
 * 
 * @help
 * Para usarlo en un evento:
 *   Script: CheckearConexion();
 */

(function() {

    
    const URL_GS = "https://script.google.com/macros/s/AKfycbzChyiDaRjPTFX9A8mAT4dbWtNT2J7zkSjL6FbqJfrkLmmFLkslYqaxlodtZqb4Q61V/exec";

    window.CheckearConexion = function() {

        fetch(URL_GS)
            .then(response => response.json())
            .then(data => {

                console.log("Respuesta:", data);

                if (data.exito) {
                    $gameMessage.add("✅ Conectados con el servidor");
                    console.log("CONECTADO");
                } else {
                    $gameMessage.add("❌ Algo no funcionó");
                    console.log("NO CONECTADO");
                }

            })
            .catch(err => {
                console.error("ERROR:", err);
                $gameMessage.add("❌ Error al conectar con el servidor");
                Graphics.printError("Error de conexión", err.message);
            });
    };

})();
