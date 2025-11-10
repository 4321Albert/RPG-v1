var GS_StorageManager = (function() {
    // Configuración del plugin
    const CONFIG = {
        SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxRO5V3ixk231TkwDilC0yBf_th7dqBPHLPzUdN2xYfcA1sfJ7EdBobDMIilefElrOssA/exec',
        LOGIN_SCENE: true,
        SAVE_INTERVAL: 30000,
        MAX_RETRIES: 3
    };

    // Polyfill para fetch si no existe
    if (!window.fetch) {
        window.fetch = function(url, options) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(options?.method || 'GET', url);
                xhr.responseType = 'json';
                if (options?.headers) {
                    for (const key in options.headers) {
                        xhr.setRequestHeader(key, options.headers[key]);
                    }
                }
                xhr.onload = () => resolve({
                    json: () => Promise.resolve(xhr.response),
                    ok: xhr.status >= 200 && xhr.status < 300
                });
                xhr.onerror = reject;
                xhr.send(options?.body);
            });
        };
    }

    // Variables internas
    let _authenticated = false;
    let _currentUser = null;
    let _authToken = null;
    let _pendingSaves = {};
    let _saveTimer = null;
    
    //-----------------------------------------------------------------------------
    // Scene_Login
    //
    // Escena personalizada para el login

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

    //-----------------------------------------------------------------------------
    // Window_Login
    //
    // Ventana de login personalizada

    function Window_Login() {
        this.initialize.apply(this, arguments);
    }

    Window_Login.prototype = Object.create(Window_Base.prototype);
    Window_Login.prototype.constructor = Window_Login;

    Window_Login.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.activate();
    };

    Window_Login.prototype.refresh = function() {
        this.contents.clear();
        this.drawTitle();
        this.drawFields();
        this.drawButton();
    };

    Window_Login.prototype.drawTitle = function() {
        const title = "Inicio de Sesión";
        const x = (this.width - this.textWidth(title)) / 2;
        this.drawText(title, x, 50, this.textWidth(title), 'center');
    };

    Window_Login.prototype.drawFields = function() {
        this.drawText("Usuario:", 150, 150, 120, 'left');
        this._usernameInput = new Window_Input(280, 150, 300, 36);
        this._usernameInput.setMaxLength(20);
        this.addWindow(this._usernameInput);
        
        this.drawText("Contraseña:", 150, 200, 120, 'left');
        this._passwordInput = new Window_Input(280, 200, 300, 36);
        this._passwordInput.setMaxLength(20);
        this._passwordInput.setPassword(true);
        this.addWindow(this._passwordInput);
    };

    Window_Login.prototype.drawButton = function() {
        const buttonWidth = 200;
        const buttonX = (this.width - buttonWidth) / 2;
        this._loginButton = new Window_Button(buttonX, 280, buttonWidth, 48, "Iniciar Sesión");
        this._loginButton.setHandler('ok', this.onLogin.bind(this));
        this.addWindow(this._loginButton);
    };

    Window_Login.prototype.onLogin = function() {
        const username = this._usernameInput.text();
        const password = this._passwordInput.text();
        
        if (!username || !password) {
            this.showMessage("Por favor ingresa usuario y contraseña");
            return;
        }
        
        this.showMessage("Conectando...");
        
        authenticate(username, password)
            .then(() => {
                SceneManager.push(Scene_Title);
            })
            .catch(error => {
                this.showMessage("Error: " + error);
            });
    };

    Window_Login.prototype.showMessage = function(message) {
        if (this._messageWindow) {
            this.removeWindow(this._messageWindow);
        }
        
        this._messageWindow = new Window_Help();
        this._messageWindow.setText(message);
        this._messageWindow.y = 350;
        this._messageWindow.width = this.width - 200;
        this._messageWindow.x = 100;
        this.addWindow(this._messageWindow);
    };

    //-----------------------------------------------------------------------------
    // Window_Input
    //
    // Ventana para entrada de texto

    function Window_Input() {
        this.initialize.apply(this, arguments);
    }

    Window_Input.prototype = Object.create(Window_Base.prototype);
    Window_Input.prototype.constructor = Window_Input;

    Window_Input.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._text = '';
        this._maxLength = 10;
        this._password = false;
        this._active = false;
        this.refresh();
    };

    Window_Input.prototype.text = function() {
        return this._text;
    };

    Window_Input.prototype.setMaxLength = function(maxLength) {
        this._maxLength = maxLength;
    };

    Window_Input.prototype.setPassword = function(password) {
        this._password = password;
        this.refresh();
    };

    Window_Input.prototype.activate = function() {
        this._active = true;
        this.refresh();
    };

    Window_Input.prototype.deactivate = function() {
        this._active = false;
        this.refresh();
    };

    Window_Input.prototype.addChar = function(char) {
        if (this._text.length < this._maxLength) {
            this._text += char;
            this.refresh();
        }
    };

    Window_Input.prototype.back = function() {
        if (this._text.length > 0) {
            this._text = this._text.slice(0, -1);
            this.refresh();
        }
    };

    Window_Input.prototype.baseTextRect = function() {
        const rect = new Rectangle();
        rect.x = 0;
        rect.y = 0;
        rect.width = this.width - this.padding * 2;
        rect.height = this.height - this.padding * 2;
        return rect;
    };

    Window_Input.prototype.refresh = function() {
        this.contents.clear();
        const rect = this.baseTextRect();
        let displayText = this._password ? '*'.repeat(this._text.length) : this._text;
        
        this.drawTextEx(displayText, rect.x, rect.y);
        
        if (this._active) {
            const textWidth = this.textWidth(displayText);
            this.drawCursorRect(rect.x + textWidth, rect.y, 12, rect.height);
        }
    };

    Window_Input.prototype.processHandling = function() {
        if (this.isOpen() && this._active) {
            if (Input.isTriggered('ok')) {
                this.deactivate();
            } else if (Input.isTriggered('backspace')) {
                this.back();
            } else {
                const char = Input.getPressedString();
                if (char) {
                    this.addChar(char);
                }
            }
        }
    };

    Window_Input.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.processHandling();
    };

    //-----------------------------------------------------------------------------
    // Window_Button
    //
    // Ventana de botón personalizada

    function Window_Button() {
        this.initialize.apply(this, arguments);
    }

    Window_Button.prototype = Object.create(Window_Base.prototype);
    Window_Button.prototype.constructor = Window_Button;

    Window_Button.prototype.initialize = function(x, y, width, height, text) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._text = text;
        this._handler = {};
        this.refresh();
    };

    Window_Button.prototype.setHandler = function(symbol, method) {
        this._handler[symbol] = method;
    };

    Window_Button.prototype.callHandler = function(symbol) {
        if (this._handler[symbol]) {
            this._handler[symbol]();
        }
    };

    Window_Button.prototype.refresh = function() {
        this.contents.clear();
        this.drawTextEx(this._text, 0, 0, this.width, 'center');
    };

    Window_Button.prototype.isTouchedInsideFrame = function() {
        const touchPos = TouchInput;
        const x = this.canvasToLocalX(touchPos.x);
        const y = this.canvasToLocalY(touchPos.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };

    Window_Button.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this.isTouchedInsideFrame() && TouchInput.isTriggered()) {
            this.callHandler('ok');
        }
    };

    // Métodos de autenticación
    function authenticate(username, password) {
        return new Promise((resolve, reject) => {
            if (!CONFIG.SCRIPT_URL) {
                reject("No se ha configurado la URL del script");
                return;
            }

            const url = CONFIG.SCRIPT_URL + "?action=auth&user=" + encodeURIComponent(username) + "&pass=" + encodeURIComponent(password);
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        _authenticated = true;
                        _currentUser = username;
                        _authToken = data.token;
                        resolve();
                    } else {
                        reject(data.message || "Error de autenticación");
                    }
                })
                .catch(error => {
                    reject("Error de conexión: " + error);
                });
        });
    }

    function handleConnectionError(error) {
        console.error("Error de conexión:", error);
        if (SceneManager._scene instanceof Scene_Login) {
            SceneManager._scene.showMessage("Error de conexión. Intenta nuevamente.");
        } else {
            SceneManager.push(Scene_Login);
        }
        _authenticated = false;
        _authToken = null;
    }

    // Métodos de almacenamiento
    function save(savefileId, json) {
        if (!_authenticated) {
            console.error("No autenticado");
            return;
        }

        _pendingSaves[savefileId] = json;
        
        if (!_saveTimer) {
            _saveTimer = setTimeout(processPendingSaves, CONFIG.SAVE_INTERVAL);
        }
    }

    function processPendingSaves() {
        _saveTimer = null;
        
        for (const savefileId in _pendingSaves) {
            if (_pendingSaves.hasOwnProperty(savefileId)) {
                sendSaveToGS(savefileId, _pendingSaves[savefileId])
                    .catch(error => {
                        console.error("Error guardando partida:", error);
                    });
            }
        }
        
        _pendingSaves = {};
    }

    function sendSaveToGS(savefileId, json) {
        return new Promise((resolve, reject) => {
            const url = CONFIG.SCRIPT_URL + "?action=save";
            const data = {
                user: _currentUser,
                token: _authToken,
                savefileId: savefileId,
                data: LZString.compressToBase64(json)
            };
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resolve();
                } else {
                    reject(data.message || "Error guardando datos");
                }
            })
            .catch(error => {
                reject("Error de conexión: " + error);
            });
        });
    }

    function load(savefileId) {
        return new Promise((resolve, reject) => {
            if (!_authenticated) {
                reject("No autenticado");
                return;
            }

            const url = CONFIG.SCRIPT_URL + "?action=load&user=" + encodeURIComponent(_currentUser) + 
                        "&token=" + encodeURIComponent(_authToken) + 
                        "&savefileId=" + savefileId;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const decompressed = LZString.decompressFromBase64(data.data);
                        resolve(decompressed);
                    } else {
                        reject(data.message || "Error cargando datos");
                    }
                })
                .catch(error => {
                    reject("Error de conexión: " + error);
                });
        });
    }

    function loadSync(savefileId) {
        if (!_authenticated) return null;
        
        const xhr = new XMLHttpRequest();
        const url = CONFIG.SCRIPT_URL + "?action=load&user=" + encodeURIComponent(_currentUser) + 
                    "&token=" + encodeURIComponent(_authToken) + 
                    "&savefileId=" + savefileId;
        
        xhr.open('GET', url, false);
        xhr.send();
        
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            if (data.success) {
                return LZString.decompressFromBase64(data.data);
            }
        }
        return null;
    }

    function exists(savefileId) {
        return new Promise((resolve, reject) => {
            if (!_authenticated) {
                resolve(false);
                return;
            }

            const url = CONFIG.SCRIPT_URL + "?action=exists&user=" + encodeURIComponent(_currentUser) + 
                        "&token=" + encodeURIComponent(_authToken) + 
                        "&savefileId=" + savefileId;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    resolve(!!data.exists);
                })
                .catch(error => {
                    console.error("Error verificando existencia:", error);
                    resolve(false);
                });
        });
    }

    function remove(savefileId) {
        return new Promise((resolve, reject) => {
            if (!_authenticated) {
                reject("No autenticado");
                return;
            }

            const url = CONFIG.SCRIPT_URL + "?action=remove";
            const data = {
                user: _currentUser,
                token: _authToken,
                savefileId: savefileId
            };
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resolve();
                } else {
                    reject(data.message || "Error eliminando datos");
                }
            })
            .catch(error => {
                reject("Error de conexión: " + error);
            });
        });
    }

    // Sobrescribir StorageManager original
    (function() {
        // Guardar referencia a métodos originales
        const _original_save = StorageManager.save.bind(StorageManager);
        const _original_load = StorageManager.load.bind(StorageManager);
        const _original_exists = StorageManager.exists.bind(StorageManager);
        const _original_remove = StorageManager.remove.bind(StorageManager);
        
        StorageManager.save = function(savefileId, json) {
            if (_authenticated) {
                save(savefileId, json);
                _original_save(savefileId, json); // Guardar local como backup
            } else {
                _original_save(savefileId, json);
            }
        };
        
        StorageManager.load = function(savefileId) {
            if (_authenticated) {
                try {
                    const result = loadSync(savefileId);
                    return result || _original_load(savefileId);
                } catch (e) {
                    console.error(e);
                    return _original_load(savefileId);
                }
            } else {
                return _original_load(savefileId);
            }
        };
        
        StorageManager.exists = function(savefileId) {
            if (_authenticated) {
                // Implementación sincrónica alternativa
                try {
                    const xhr = new XMLHttpRequest();
                    const url = CONFIG.SCRIPT_URL + "?action=exists&user=" + 
                                encodeURIComponent(_currentUser) + 
                                "&token=" + encodeURIComponent(_authToken) + 
                                "&savefileId=" + savefileId;
                    
                    xhr.open('GET', url, false);
                    xhr.send();
                    
                    if (xhr.status === 200) {
                        const data = JSON.parse(xhr.responseText);
                        return !!data.exists;
                    }
                    return _original_exists(savefileId);
                } catch (e) {
                    console.error(e);
                    return _original_exists(savefileId);
                }
            } else {
                return _original_exists(savefileId);
            }
        };
        
        StorageManager.remove = function(savefileId) {
            if (_authenticated) {
                remove(savefileId).catch(console.error);
            }
            _original_remove(savefileId);
        };



        const alias_Scene_Boot_start = Scene_Boot.prototype.start;
        Scene_Boot.prototype.start = function() {
            alias_Scene_Boot_start.call(this);
            if (GS_StorageManager.CONFIG.LOGIN_SCENE) {
                SceneManager.goto(Scene_Login);
            }
        };

        Scene_Login.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if (this._loginWindow) {
        this._loginWindow.update(); // asegúrate que los subcomponentes actualicen
    }
};

        
    
   
    })();

    // Exportar métodos públicos
    return {
        CONFIG: CONFIG,
        authenticate: authenticate,
        save: save,
        load: load,
        exists: exists,
        remove: remove,
        isAuthenticated: function() { return _authenticated; },
        getCurrentUser: function() { return _currentUser; }
    };
})();