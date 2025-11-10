/*:
 * @plugindesc Muestra las variables de Tarea 2, Tarea 3 y Oro en el menú principal.
 * @author Luis
 *
 * @param vida Variable ID
 * @type variable
 * @desc ID de la variable para Tarea 2 (ID 4 por defecto)
 * @default 4
 *
 * @param vida1 Variable ID
 * @type variable
 * @desc ID de la variable para Tarea 3 (ID 160 por defecto)
 * @default 160
 *
 * @help
 * Comandos de plugin:
 *   vida2 add/sub/set X - Modifica Tarea 2
 *   vida3 add/sub/set X - Modifica Tarea 3
 */

(() => {
    const parameters = PluginManager.parameters('MultiHUD');
    const vidaVarId = Number(parameters['vida Variable ID'] || 4);
    const vida1VarId = Number(parameters['vida1 Variable ID'] || 160);

    // ───────────────────────────────
    // Comandos del plugin para modificar variables
    // ───────────────────────────────
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        command = command.toLowerCase();
        
        if (command === 'vida2' || command === 'vida3') {
            const varId = command === 'vida2' ? vidaVarId : vida1VarId;
            const action = args[0];
            const value = Number(args[1]);
            const current = $gameVariables.value(varId);

            if (action === 'add') {
                $gameVariables.setValue(varId, current + value);
            } else if (action === 'sub') {
                $gameVariables.setValue(varId, current - value);
            } else if (action === 'set') {
                $gameVariables.setValue(varId, value);
            }
        }
    };

    // ───────────────────────────────
    // Ventana personalizada con los tres valores
    // ───────────────────────────────
    function Window_MenuScores() {
        this.initialize(...arguments);
    }

    Window_MenuScores.prototype = Object.create(Window_Base.prototype);
    Window_MenuScores.prototype.constructor = Window_MenuScores;

    Window_MenuScores.prototype.initialize = function(x, y) {
        const width = 240;
        const height = this.fittingHeight(3); // espacio para 3 líneas
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    Window_MenuScores.prototype.refresh = function() {
        this.contents.clear();
        const gold = $gameParty.gold();
        const vida = $gameVariables.value(vidaVarId);
        const vida1 = $gameVariables.value(vida1VarId);

        // Tarea 2
        this.changeTextColor(this.systemColor());
        this.drawText("Tarea 2:", 0, 0, 120, 'left');
        this.resetTextColor();
        this.drawText(vida, 60, 0, 120, 'right');

        // Tarea 3
        this.changeTextColor(this.systemColor());
        this.drawText("Tarea 3:", 0, this.lineHeight(), 120, 'left');
        this.resetTextColor();
        this.drawText(vida1, 60, this.lineHeight(), 120, 'right');

        // Oro
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.currencyUnit, 0, this.lineHeight() * 2, 120, 'left');
        this.resetTextColor();
        this.drawText(gold, 60, this.lineHeight() * 2, 120, 'right');
    };

    Window_MenuScores.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.refresh();
    };

    // ───────────────────────────────
    // Insertar la nueva ventana en el menú
    // ───────────────────────────────
    Scene_Menu.prototype.createGoldWindow = function() {
        const width = 240;
        const height = Window_Base.prototype.fittingHeight.call(new Window_Base(0,0,0,0), 3);
        const x = 0;
        const y = Graphics.boxHeight - height;
        this._goldWindow = new Window_MenuScores(x, y);
        this.addWindow(this._goldWindow);
    };
})();