/*:
 * @plugindesc Guardado en Google Sheets mediante API externa (Apps Script) - v1.0
 * @author KA EduSoft
 *
 * @help Este plugin reemplaza el guardado local por comunicaciÃ³n con Google Sheets.
 */

(function() {

  const URL_API = "https://script.google.com/macros/s/AKfycbwRrW5LiWoDYnoqeEkQTJ-x0rc9_UOWIVhMbZSvgjbvMVhoIl9sWbiIBNbB7Hf9PizWuw/exec";
  const ServerActions = {
      ACT_SAVE_GAME: "SaveGame",
      ACT_LOAD_GAME: "LoadGame",
      ACT_CHECK_SAVE: "CheckSave"
  };


  /* Solicita login al iniciar. Se sustituye la escena de boot
   * para que el usuario tenga que logearse obligatoriamente.
   */
  Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Login);
  };

 
 /**
  * Creamos la escena de loguin.
  * @returns {Web_App_Scrpit_ServiceL#8.Scene_Login}
  */
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
  this.createBackground();
  this.createInputs();
};

Scene_Login.prototype.createBackground = function() {
  this._backgroundSprite = new Sprite();
  this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
  this.addChild(this._backgroundSprite);
};

// Desactiva el procesamiento de teclas por parte del juego mientras escribes en un input
Input._shouldPreventDefault = function(keyCode) {
  const active = document.activeElement;
  if (active && (active.id === "login-username" || active.tagName === "login-password")) {
        return true; // no dejar que RPG Maker MV lo procese
  }

  // comportamiento por defecto de RPG Maker
  switch (keyCode) {
    case 8:   // backspace
    case 33:  // pageup
    case 34:  // pagedown
    case 37:  // left arrow
    case 38:  // up arrow
    case 39:  // right arrow
    case 40:  // down arrow
      return true;
  }
  return false;
};

Scene_Login.prototype.createInputs = function() {
    const div = document.createElement("div");
    div.id = "login-container";
    div.style.position = "absolute";
    div.style.top = "30%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.backgroundColor = "rgba(0,0,0,0.6)";
    div.style.padding = "20px";
    div.style.borderRadius = "10px";
    div.style.color = "white";
    div.style.zIndex = 100;

    div.innerHTML = `
        <label>Usuario:</label><br>
        <input type="text" id="login-username" style="width: 200px;"><br><br>
        <label>ContraseÃ±a:</label><br>
        <input type="password" id="login-password" style="width: 200px;"><br><br>
        <button id="login-button">Iniciar sesiÃ³n</button>
    `;

    document.body.appendChild(div);

    document.getElementById("login-button").addEventListener("click", () => {
      this.onLoginOk();
    });

    document.addEventListener("keydown", this._onEnterKey = (event) => {
      if (event.key === "Enter") this.onLoginOk();
    });
};

document.addEventListener('keydown', function(e) {
  const active = document.activeElement;
  const isInput = active && (
    active.tagName === 'INPUT' || active.tagName === 'TEXTAREA'
  );

  if (isInput) {
    // Prevenir que RPG Maker intercepte estas teclas
    e.stopImmediatePropagation();
  }
}, true);


    Scene_Login.prototype.onLoginOk = function() {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        if (!username || !password) {
          alert("Debes completar ambos campos.");
          return;
        }

        fetch(`${URL_API}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
          .then(r => r.json())
          .then(data => {
              if (data.success) {
                if (data.save) {
                  const saveData = JsonEx.parse(decodeURIComponent(data.save));
                  DataManager.loadGameDataFromObject(saveData);
                } else {
                  // No hay save aÃºn, comenzar partida nueva
                  DataManager.setupNewGame();
                }

                $gameSystem._username = username;
                $gameSystem._password = password;
                this.cleanupInputs();
                SceneManager.goto(Scene_Map);
              } else {
                alert("Usuario o contraseÃ±a incorrectos.");
              }
        });
    };

    Scene_Login.prototype.cleanupInputs = function() {
        const div = document.getElementById("login-container");
        if (div) div.remove();
        document.removeEventListener("keydown", this._onEnterKey);
    };

    Scene_Login.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        this.cleanupInputs();
    };

 
    // En Scene_Title
   Scene_Title.prototype.commandContinue = function() {
        const username = $gameSystem._username;
        const password = $gameSystem._password;

        fetch(URL_API, {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify({ type: ServerActions.ACT_LOAD_GAME, username, password }),
          headers: { "Content-Type": "text/plain;charset=utf-8" }
        })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.save) {
            const saveData = JsonEx.parse(decodeURIComponent(data.save));
            DataManager.loadGameDataFromObject(saveData);
            SceneManager.goto(Scene_Map);
          } else {
            alert("No se pudo cargar la partida.");
          }
        })
        .catch(e => {
          alert("Error al cargar la partida.");
          console.error(e);
        });
   };

    // Deshabilitar "Continuar" si no hay login
    Scene_Title.prototype.createCommandWindow = function() {
      this._commandWindow = new Window_TitleCommand();
      this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
      this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
      this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
      this.addWindow(this._commandWindow);

      // Solo mostrar continuar si hay login en memoria
      if (!$gameSystem._username || !$gameSystem._password) {
        this._commandWindow._list = this._commandWindow._list.filter(cmd => cmd.symbol !== 'continue');
      }
    };


    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);

        // Deshabilita "Continuar" por defecto
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow._list.forEach(cmd => {
          if (cmd.symbol === 'continue') cmd.enabled = false;
          if (cmd.symbol === 'newGame') cmd.enabled = false;
        });

        // Consultar si hay partida guardada
        this.checkRemoteSave();
    };

    Scene_Title.prototype.checkRemoteSave = function() {
        const username = $gameSystem._username;
        const password = $gameSystem._password;

        if (!username || !password) return;

        fetch(URL_API, {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify({ type: ServerActions.ACT_CHECK_SAVE, username, password }),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success && data.hasSave) {
                this.enableContinueOption();
            }
        })
        .catch(e => {
          console.error("Error consultando partida remota:", e);
        });
    };

    Scene_Title.prototype.enableContinueOption = function() {
        const commandWindow = this._commandWindow;

        // Reemplaza la lista completa para asegurar la actualizaciÃ³n visual
        commandWindow._list = [];
        if (DataManager.isAnySavefileExists()) {
          commandWindow.addCommand(TextManager.continue_, 'continue', true);
        } else {
          commandWindow.addCommand(TextManager.continue_, 'continue', true); // Forzamos que estÃ© habilitado
        }
        commandWindow.addCommand(TextManager.newGame, 'newGame', false); // Deshabilitamos Nueva partida
        commandWindow.addCommand(TextManager.options, 'options', true);

        commandWindow.select(0);
        commandWindow.refresh();
    };

    Scene_Title.prototype.start = function() {
        location.reload(); // fuerza recarga total y volverÃ¡ a Scene_Login
    };






  // Override al guardado
    DataManager.saveGame = function(savefileId) {
        const save = encodeURIComponent(JsonEx.stringify(this.makeSaveContents()));
        const username = $gameSystem._username;
        const password = $gameSystem._password;

        return fetch(URL_API, {
              redirect: "follow",
              method: "POST",
              body: JSON.stringify({ username, password, type: ServerActions.ACT_SAVE_GAME , save, var4: $gameVariables.value(4),
              var160: $gameVariables.value(160) }),
              headers: {
                  "Content-Type": "text/plain;charset=utf-8"
              }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log("Guardado exitoso");
            return true;
          } else {
            console.error("Error en la respuesta del servidor.");
            return false;
          }
        });
    };


    DataManager.loadGameDataFromObject = function(obj) {
        try {
          this.createGameObjects();
          this.extractSaveContents(obj);
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
    };

    DataManager.loadGame = function(savefileId) {
        const username = $gameSystem._username;
        const password = $gameSystem._password;

        return fetch(URL_API, {
            redirect: "follow",
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({ username, password, type: ServerActions.ACT_LOAD_GAME })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success && data.save) {
            const json = data.save;
            const saveData = JsonEx.parse(json);
            this.extractSaveContents(saveData);
            console.log("Carga exitosa");
            return true;
          } else {
            console.warn("No se encontrÃ³ guardado o error al cargar.");
            return false;
          }
        })
        .catch(err => {
          console.error("Error al cargar partida:", err);
          return false;
        });
    };
})();