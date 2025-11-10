(() => {
  const parameters = PluginManager.parameters('TareaTres');
  const vida1VariableId = 160;

  // ───────────────────────────────
  // Comandos del plugin
  // ───────────────────────────────
  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command.toLowerCase() === 'tareatres') {
      const action = args[0];
      const value = Number(args[1]);
      const current = $gameVariables.value(vida1VariableId);

      if (action === 'add') {
        $gameVariables.setValue(vida1VariableId, current + value);
      } else if (action === 'sub') {
        $gameVariables.setValue(vida1VariableId, current - value);
      } else if (action === 'set') {
        $gameVariables.setValue(vida1VariableId, value);
      }
    }
  };

  // ───────────────────────────────
  // Ventana personalizada
  // ───────────────────────────────
  function Window_Menuvida1GoldTarea3() {
    this.initialize(...arguments);
  }

  Window_Menuvida1GoldTarea3.prototype = Object.create(Window_Base.prototype);
  Window_Menuvida1GoldTarea3.prototype.constructor = Window_Menuvida1GoldTarea3;

  Window_Menuvida1GoldTarea3.prototype.initialize = function(x, y) {
    const width = 240;
    const height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
  };

  Window_Menuvida1GoldTarea3.prototype.refresh = function() {
    this.contents.clear();
    const vida1 = $gameVariables.value(vida1VariableId);
    this.changeTextColor(this.systemColor());
    this.drawText("Puntos Tarea 3:", 0, 0, 160, 'left');
    this.resetTextColor();
    this.drawText(vida1, 0, 0, 240, 'right');
  };

  Window_Menuvida1GoldTarea3.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.refresh();
  };

  // ───────────────────────────────
  // Insertar ventana sin romper otros plugins
  // ───────────────────────────────
  const _Scene_Menu_createGoldWindow = Scene_Menu.prototype.createGoldWindow;
  Scene_Menu.prototype.createGoldWindow = function() {
    if (_Scene_Menu_createGoldWindow) {
      _Scene_Menu_createGoldWindow.call(this);
    }

    let x = 0;
    let y = Graphics.boxHeight - Window_Base.prototype.fittingHeight.call(new Window_Base(0,0,0,0), 1);

    // Si existe la ventana de oro del otro plugin, nos acomodamos encima
    if (this._goldWindow) {
      x = this._goldWindow.x;
      y = this._goldWindow.y - Window_Base.prototype.fittingHeight.call(new Window_Base(0,0,0,0), 1);
    }

    this._goldWindowTarea3 = new Window_Menuvida1GoldTarea3(x, y);
    this.addWindow(this._goldWindowTarea3);
  };
})();

