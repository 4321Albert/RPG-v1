//=============================================================================
// SimpleLogin.js
//=============================================================================
/*:
 * @plugindesc Muestra una ventana de login simple al iniciar el juego
 * @author TuNombre
 *
 * @help
 * Este plugin muestra una ventana de login al iniciar el juego.
 * Usuario se guarda en la variable 1, contraseña en la variable 2.
 *
 * @param Usuario Variable ID
 * @desc ID de la variable para el nombre de usuario
 * @default 1
 *
 * @param Contraseña Variable ID
 * @desc ID de la variable para la contraseña
 * @default 2
 */

(function() {
    var parameters = PluginManager.parameters('SimpleLogin');
    var userVarId = Number(parameters['Usuario Variable ID'] || 200);
    var passVarId = Number(parameters['Contraseña Variable ID'] || 201);

    // Alias Scene_Boot para mostrar login primero
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        SceneManager.push(Scene_Login);
    };

    // Escena de Login
    function Scene_Login() {
        this.initialize.apply(this, arguments);
    }

    Scene_Login.prototype = Object.create(Scene_Base.prototype);
    Scene_Login.prototype.constructor = Scene_Login;

    Scene_Login.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_Login.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createLoginWindow();
    };

    Scene_Login.prototype.createLoginWindow = function() {
        this._loginWindow = new Window_Login(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.addWindow(this._loginWindow);
    };

    // Ventana de Login
    function Window_Login() {
        this.initialize.apply(this, arguments);
    }

    Window_Login.prototype = Object.create(Window_Base.prototype);
    Window_Login.prototype.constructor = Window_Login;

    Window_Login.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.opacity = 0;
        this._username = '';
        this._password = '';
        this._activeField = 'username'; // 'username' or 'password'
        this.refresh();
        this.activate();
    };

    Window_Login.prototype.refresh = function() {
        this.contents.clear();
        this.drawText('Sistema de Login', 0, 50, this.width, 'center');
        
        // Campo de usuario
        this.drawText('Usuario:', this.width/2 - 100, 120, 100);
        this.drawText(this._username, this.width/2 + 10, 120, 200);
        if (this._activeField === 'username') {
            this.drawCursor(this.textWidth(this._username) + this.width/2 + 10, 120);
        }
        
        // Campo de contraseña
        this.drawText('Contraseña:', this.width/2 - 100, 160, 100);
        var stars = '*'.repeat(this._password.length);
        this.drawText(stars, this.width/2 + 10, 160, 200);
        if (this._activeField === 'password') {
            this.drawCursor(this.textWidth(stars) + this.width/2 + 10, 160);
        }
        
        // Botón
        this.drawText('Presiona ENTER para continuar', 0, 220, this.width, 'center');
    };

    Window_Login.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.processInput();
    };

    Window_Login.prototype.processInput = function() {
        if (Input.isTriggered('tab')) {
            this._activeField = this._activeField === 'username' ? 'password' : 'username';
            this.refresh();
        }
        
        if (Input.isTriggered('backspace')) {
            if (this._activeField === 'username') {
                this._username = this._username.slice(0, -1);
            } else {
                this._password = this._password.slice(0, -1);
            }
            this.refresh();
        }
        
        if (Input.isTriggered('ok')) {
            $gameVariables.setValue(userVarId, this._username);
            $gameVariables.setValue(passVarId, this._password);
            SceneManager.goto(Scene_Map);
        }
        
        var text = Input.inputText();
        if (text) {
            if (this._activeField === 'username') {
                this._username += text;
            } else {
                this._password += text;
            }
            this.refresh();
        }
    };
})();