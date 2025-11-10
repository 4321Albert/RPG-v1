//=============================================================================
// GS_LoginScene.js
//=============================================================================
/*:
 * @target MV
 * @plugindesc Muestra una pantalla de login con usuario y contraseña que se validan con Google Sheets al iniciar el juego.
 * @author Luis
 *
 * @help Este plugin reemplaza la escena inicial del juego por una ventana de login.
 * Valida el usuario y contraseña con Google Apps Script y si son correctos,
 * entra a la pantalla de título. También reemplaza el sistema de guardado local
 * con almacenamiento en Google Sheets.
 */

(function() {
    let user = "";
    let password = "";

    function authenticate(username, password) {
    const url = `https://script.google.com/macros/s/AKfycbxMaiDAR71Bk5vlnLFvU7iOGb6swLomDASjvPV_-TJL0OTGXp9sFWyovUEy_uGmp0Fh_A/exec?action=auth&user=${username}&pass=${password}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return true;
            } else {
                throw new Error("Credenciales inválidas");
            }
        });
}


    function createInput(id, placeholder, type = "text") {
        const input = document.createElement("input");
        input.id = id;
        input.type = type;
        input.placeholder = placeholder;
        input.style.position = "absolute";
        input.style.top = (Graphics.height / 2 + (type === "password" ? 40 : 0)) + "px";
        input.style.left = (Graphics.width / 2 - 100) + "px";
        input.style.width = "200px";
        input.style.zIndex = 100;
        document.body.appendChild(input);
        return input;
    }

    function removeInputs() {
        const userInput = document.getElementById("usernameInput");
        const passInput = document.getElementById("passwordInput");
        if (userInput) document.body.removeChild(userInput);
        if (passInput) document.body.removeChild(passInput);
    }

    function createButton(label, callback) {
        const button = document.createElement("button");
        button.innerText = label;
        button.style.position = "absolute";
        button.style.top = (Graphics.height / 2 + 100) + "px";
        button.style.left = (Graphics.width / 2 - 50) + "px";
        button.style.zIndex = 100;
        button.onclick = callback;
        document.body.appendChild(button);
        return button;
    }

    const alias_Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        alias_Scene_Boot_start.call(this);
        SceneManager.goto(Scene_Login);
    };

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
        this._usernameInput = createInput("usernameInput", "Usuario");
        this._passwordInput = createInput("passwordInput", "Contraseña", "password");
        this._loginButton = createButton("Iniciar sesión", () => this.onLogin());
    };

    Scene_Login.prototype.onLogin = function() {
        const username = this._usernameInput.value;
        const pass = this._passwordInput.value;

        authenticate(username, pass)
            .then(() => {
                user = username;
                password = pass;
                removeInputs();
                document.body.removeChild(this._loginButton);
                SceneManager.goto(Scene_Title);
            })
            .catch(err => {
                alert("Error de autenticación: " + err.message);
            });
    };

    Scene_Login.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);

    // Elimina elementos de forma segura
    const elements = [
        this._loginWindow,
        this._userInput,
        this._passwordInput,
        this._loginButton
    ];

    elements.forEach(el => {
        if (el && el.parent) {
            el.parent.removeChild(el);
        }
    });
};


})();