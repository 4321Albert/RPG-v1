/*:
 * @plugindesc Agrega un botón "Libreta" al menú con tres botones: Matriz de Habitantes, Indicaciones y Variables. Muestra ventana personalizada. @author Luis
 * @help
 * Este plugin no requiere configuración adicional.
 * imagen en la carpeta img/img_pluging/
 */

(function() {
  // === CONFIGURACIÓN DEL DIARIO ===
  const DiarioConfig = {
    x: 6,
    y: 133,
    width: 118,
    height: 28,
    backgroundColor: "rgba(99, 97, 97, 0.8)",
    defaultTextColor: "#000000",
    defaultFontSize: 22,
  };


  const Box1 = {
    x: 130,
    y: 133,
    width: 108,
    height: 28,
    backgroundColor: "rgba(99, 97, 97, 0.8)",
    defaultTextColor: "#000000",
    defaultFontSize: 15,
  };
  


  


  // === AGREGAR BOTÓN "LIBRETA" AL MENÚ ===
  const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    this.addCommand("Libreta", "libreta", true);
  };

  const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("libreta", this.commandLibreta.bind(this));
  };

  Scene_Menu.prototype.commandLibreta = function() {
    SceneManager.push(Scene_Libreta);
  };

  // === ESCENA LIBRETA PERSONALIZADA ===
  function Scene_Libreta() {
    this.initialize(...arguments);
  }

  Scene_Libreta.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_Libreta.prototype.constructor = Scene_Libreta;

  Scene_Libreta.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_Libreta.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createButtons();
  };

  Scene_Libreta.prototype.createButtons = function() {
    const buttonTitles = ["Matriz de Habitantes", "Indicaciones", "Variables"];
    const buttonCommands = ["matriz", "indicaciones", "variables"];
    this._buttons = [];

    const startY = Graphics.height / 2 - 100;
    const centerX = Graphics.width / 2 - 100;

    for (let i = 0; i < 3; i++) {
      const button = new Window_CommandButton(centerX, startY + i * 80, 200, buttonTitles[i]);
      button.setHandler("ok", this.onButtonOk.bind(this, buttonCommands[i]));
      this.addChild(button);
      this._buttons.push(button);
    }
  };

  Scene_Libreta.prototype.onButtonOk = function(command) {
    SoundManager.playOk();
    switch (command) {
      case "matriz":
        SceneManager.push(Scene_MatrizHabitantes);
        break;
      case "indicaciones":
        alert("Mostrar indicaciones");
        break;
      case "variables":
        alert("Mostrar variables");
        break;
    }
  };

  Scene_Libreta.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        SceneManager.pop();
    }
  };

  // === ESCENA MATRIZ DE HABITANTES (con imagen de fondo y texto) ===
  function Scene_MatrizHabitantes() {
    this.initialize(...arguments);
  }

  Scene_MatrizHabitantes.prototype = Object.create(Scene_Base.prototype);
  Scene_MatrizHabitantes.prototype.constructor = Scene_MatrizHabitantes;

  Scene_MatrizHabitantes.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_MatrizHabitantes.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createTextBox();
    this.createTextBox1();
    
  };

  Scene_MatrizHabitantes.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    const bitmap = ImageManager.loadBitmap("img/img_pluging/", "Matris_diario");
    bitmap.addLoadListener(() => {
      this._backgroundSprite.bitmap = bitmap;
      const scaleX = Graphics.width / bitmap.width;
      const scaleY = Graphics.height / bitmap.height;
      this._backgroundSprite.scale.x = scaleX;
      this._backgroundSprite.scale.y = scaleY;
    });
    this.addChild(this._backgroundSprite);
  };

  Scene_MatrizHabitantes.prototype.createTextBox = function() {
    const width = DiarioConfig.width;
    const height = DiarioConfig.height;
    const bitmap = new Bitmap(width, height);

    // Fondo blanco semi transparente
    bitmap.fillRect(0, 0, width, height, DiarioConfig.backgroundColor);

    // Texto ejemplo
    const texto = $gameSystem._diarioTexto || "Habitantes.";
    const color = $gameSystem._diarioTextoColor || DiarioConfig.defaultTextColor;
    const size = $gameSystem._diarioTextoSize || DiarioConfig.defaultFontSize;

    bitmap.textColor = color;
    bitmap.fontSize = size;
    bitmap.outlineColor = 'rgba(0, 0, 0, 0)'; // Sin contorno (sombra)
    bitmap.outlineWidth = 0;                 // Sin ancho de contorno
    bitmap.drawText(texto, 10, 10, width - 20, height - 20, 'left');

    this._textSprite = new Sprite(bitmap);
    this._textSprite.x = DiarioConfig.x;
    this._textSprite.y = DiarioConfig.y;

    this.addChild(this._textSprite);
  };

  Scene_MatrizHabitantes.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
  };



  









  Scene_MatrizHabitantes.prototype.createTextBox1 = function() {
    const boxConfig = Box1; 
    const bitmap = new Bitmap(boxConfig.width, boxConfig.height);

    // Fondo
    bitmap.fillRect(0, 0, boxConfig.width, boxConfig.height, boxConfig.backgroundColor);

    // Texto desde Variable ID 10 (o texto por defecto)
    const texto1 = $gameVariables.value(10) || "Habitantes."; // << Cambio clave aquí
    const textoColor = boxConfig.defaultTextColor;
    const textoSize = boxConfig.defaultFontSize;

    bitmap.textColor = textoColor;
    bitmap.fontSize = textoSize;
    bitmap.outlineColor = 'rgba(0, 0, 0, 0)';
    bitmap.outlineWidth = 0;
    bitmap.drawText(texto1, 10, 10, boxConfig.width - 20, boxConfig.height - 20, 'left');

    this._cuadroTexto = new Sprite(bitmap);
    this._cuadroTexto.x = boxConfig.x;
    this._cuadroTexto.y = boxConfig.y;

    this.addChild(this._cuadroTexto);
};
  










  // === BOTÓN PERSONALIZADO ===
  function Window_CommandButton(x, y, width, text) {
    const height = 60;
    Window_Command.prototype.initialize.call(this, x, y, width, height);
    this._text = text;
    this.refresh();
  }

  Window_CommandButton.prototype = Object.create(Window_Command.prototype);
  Window_CommandButton.prototype.constructor = Window_CommandButton;

  Window_CommandButton.prototype.makeCommandList = function() {
    this.addCommand(this._text, 'ok');
  };

})();
