/*:
 * @plugindesc Muestra una variable como "Tarea_2" junto al Oro en el menú principal.
 * @author Luis
 *
 * @param Vida Variable ID
 * @type variable
 * @desc ID de la variable que se usará es lel id 4 de las varibles del sistema
 * @default 1
 *
 * @help
 * Comandos de plugin:
 *  
 *   
 */

(() => {
  const parameters = PluginManager.parameters('VidaHUD');
  const vidaVariableId = 4;

  // ───────────────────────────────
  // Comandos del plugin para modificar la variable
  // ───────────────────────────────
  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command.toLowerCase() === 'vida') {
      const action = args[0];
      const value = Number(args[1]);
      const current = $gameVariables.value(vidaVariableId);

      if (action === 'add') {
        $gameVariables.setValue(vidaVariableId, current + value);
      } else if (action === 'sub') {
        $gameVariables.setValue(vidaVariableId, current - value);
      } else if (action === 'set') {
        $gameVariables.setValue(vidaVariableId, value);
      }
    }
  };

  // ───────────────────────────────
  // Ventana personalizada con Oro
  // ───────────────────────────────
  function Window_MenuVidaGold() {
    this.initialize(...arguments);
  }

  Window_MenuVidaGold.prototype = Object.create(Window_Base.prototype);
  Window_MenuVidaGold.prototype.constructor = Window_MenuVidaGold;

  Window_MenuVidaGold.prototype.initialize = function(x, y) {
    const width = 240;
    const height = this.fittingHeight(2); // espacio para 2 líneas
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
  };

  Window_MenuVidaGold.prototype.refresh = function() {
    this.contents.clear();
    const gold = $gameParty.gold();
    const vida = $gameVariables.value(vidaVariableId);

    this.changeTextColor(this.systemColor());
    this.drawText("Puntos Totales Tarea 2:", 0, 0, 120, 'left');
    this.resetTextColor();
    this.drawText(vida, 60, 0, 120, 'right');

    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.currencyUnit, 0, this.lineHeight(), 120, 'left');
    this.resetTextColor();
    this.drawText(gold, 60, this.lineHeight(), 120, 'right');
  };

  Window_MenuVidaGold.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.refresh();
  };

  // ───────────────────────────────
  // Insertar la nueva ventana en el menú
  // ───────────────────────────────
  Scene_Menu.prototype.createGoldWindow = function() {
    const width = 240;
    const height = Window_Base.prototype.fittingHeight.call(new Window_Base(0,0,0,0), 2);
    const x = 0;
    const y = Graphics.boxHeight - height;
    this._goldWindow = new Window_MenuVidaGold(x, y);
    this.addWindow(this._goldWindow);
  };
})();
