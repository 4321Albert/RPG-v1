/*:
 * @plugindesc Muestra "Tarea 2" y "Tarea 3" en el menú, usando posiciones fijas X/Y y con espacio entre ellas.
 * @author Luis
 *
 * @param vida Variable ID
 * @type variable
 * @desc ID de la variable para Tarea 2.
 * @default 4
 *
 * @param vida1 Variable ID
 * @type variable
 * @desc ID de la variable para Tarea 3.
 * @default 5
 *
 * @help
 * Comandos de plugin:
 *   tareados add X
 *   tareados sub X
 *   tareados set X
 *
 *   tareatres add X
 *   tareatres sub X
 *   tareatres set X
 */

(() => {
  const parameters = PluginManager.parameters('TareasHUD');
  const vidaVariableId = Number(parameters['vida'] || 4);   // Tarea 2
  const vida1VariableId = Number(parameters['vida1'] || 5); // Tarea 3

  // 📌 POSICIONES MANUALES
  const tarea2X = 0;    // Posición X de Tarea 2
  const tarea2Y = 300;  // Posición Y de Tarea 2
  const espacioEntre = 10; // Distancia en píxeles entre Tarea 2 y Tarea 3

  //───────────────────────────────
  // Comandos de plugin
  //───────────────────────────────
  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    const action = args[0];
    const value = Number(args[1] || 0);

    if (command.toLowerCase() === 'tareados') {
      const current = $gameVariables.value(vidaVariableId);
      if (action === 'add') $gameVariables.setValue(vidaVariableId, current + value);
      if (action === 'sub') $gameVariables.setValue(vidaVariableId, current - value);
      if (action === 'set') $gameVariables.setValue(vidaVariableId, value);
    }

    if (command.toLowerCase() === 'tareatres') {
      const current = $gameVariables.value(vida1VariableId);
      if (action === 'add') $gameVariables.setValue(vida1VariableId, current + value);
      if (action === 'sub') $gameVariables.setValue(vida1VariableId, current - value);
      if (action === 'set') $gameVariables.setValue(vida1VariableId, value);
    }
  };

  //───────────────────────────────
  // Ventana Tarea 2
  //───────────────────────────────
  function Window_MenuVidaTarea2() {
    this.initialize(...arguments);
  }
  Window_MenuVidaTarea2.prototype = Object.create(Window_Base.prototype);
  Window_MenuVidaTarea2.prototype.constructor = Window_MenuVidaTarea2;

  Window_MenuVidaTarea2.prototype.initialize = function(x, y) {
    const width = 240;
    const height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
  };

  Window_MenuVidaTarea2.prototype.refresh = function() {
    this.contents.clear();
    const vida = $gameVariables.value(vidaVariableId);
    this.changeTextColor(this.systemColor());
    this.drawText("Puntos Tarea 2:", 0, 0, 160, 'left');
    this.resetTextColor();
    this.drawText(vida, 0, 0, 240, 'right');
  };

  Window_MenuVidaTarea2.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.refresh();
  };

  //───────────────────────────────
  // Ventana Tarea 3
  //───────────────────────────────
  function Window_MenuVida1Tarea3() {
    this.initialize(...arguments);
  }
  Window_MenuVida1Tarea3.prototype = Object.create(Window_Base.prototype);
  Window_MenuVida1Tarea3.prototype.constructor = Window_MenuVida1Tarea3;

  Window_MenuVida1Tarea3.prototype.initialize = function(x, y) {
    const width = 240;
    const height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
  };

  Window_MenuVida1Tarea3.prototype.refresh = function() {
    this.contents.clear();
    const vida1 = $gameVariables.value(vida1VariableId);
    this.changeTextColor(this.systemColor());
    this.drawText("Puntos Tarea 3:", 0, 0, 160, 'left');
    this.resetTextColor();
    this.drawText(vida1, 0, 0, 240, 'right');
  };

  Window_MenuVida1Tarea3.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.refresh();
  };

  //───────────────────────────────
  // Insertar ambas ventanas con posiciones fijas
  //───────────────────────────────
  const _Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function() {
    _Scene_Menu_create.call(this);

    // Crear Tarea 2
    this._tarea2Window = new Window_MenuVidaTarea2(tarea2X, tarea2Y);
    this.addWindow(this._tarea2Window);

    // Crear Tarea 3 debajo de Tarea 2
    const tarea3Y = tarea2Y + this._tarea2Window.height + espacioEntre;
    this._tarea3Window = new Window_MenuVida1Tarea3(tarea2X, tarea3Y);
    this.addWindow(this._tarea3Window);
  };
})();
