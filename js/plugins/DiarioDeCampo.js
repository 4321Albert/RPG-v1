/*:
 * @plugindesc Diario de Campo con imagen de fondo y caja de texto personalizable. Muestra texto al interactuar con evento "EV003". [Luis]
 * @author Luis
 *
 * @help
 * Requiere imagen en: img/img_pluging/Matriz 1.png
 * 
 * Usar en el evento EV003 un script:
 *   $gameSystem._diarioTexto = "Texto nuevo para el diario.";
 *   $gameSystem._diarioTextoColor = "#ff0000";
 *   $gameSystem._diarioTextoSize = 24;         
 */

(function () {
  // Ajustes personalizables de la caja de texto
  const DiarioConfig = {
    x: 6,
    y: 126,
    width: 118,
    height: 31,
    backgroundColor: '#fbf9f9ff',
    defaultTextColor: '#0e0e0eff',
    defaultFontSize: 20,
  };

  // Agrega comando al menú
  const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    _Window_MenuCommand_addOriginalCommands.call(this);
    this.addCommand("Diario de Campo", "diarioDeCampo", true);
  };

  // Escena personalizada
  function Scene_DiarioDeCampo() {
    this.initialize(...arguments);
  }

  Scene_DiarioDeCampo.prototype = Object.create(Scene_Base.prototype);
  Scene_DiarioDeCampo.prototype.constructor = Scene_DiarioDeCampo;

  Scene_DiarioDeCampo.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_DiarioDeCampo.prototype.create = function () {
    Scene_Base.prototype.create.call(this);

    // Fondo escalado
    this._backgroundSprite = new Sprite();
    const bitmap = ImageManager.loadBitmap("img/img_pluging/", "Diario");
    bitmap.addLoadListener(() => {
      this._backgroundSprite.bitmap = bitmap;
      const scaleX = Graphics.width / bitmap.width;
      const scaleY = Graphics.height / bitmap.height;
      this._backgroundSprite.scale.x = scaleX;
      this._backgroundSprite.scale.y = scaleY;
    });
    this.addChild(this._backgroundSprite);

    // Caja de texto
    this.createTextBox();
  };

  Scene_DiarioDeCampo.prototype.createTextBox = function () {
    const width = DiarioConfig.width;
    const height = DiarioConfig.height;
    const bitmap = new Bitmap(width, height);
    
    // Fondo de la caja
    bitmap.fillRect(0, 0, width, height, DiarioConfig.backgroundColor);

    // Texto inicial
    const texto = $gameSystem._diarioTexto || "";
    const color = $gameSystem._diarioTextoColor || DiarioConfig.defaultTextColor;
    const size = $gameSystem._diarioTextoSize || DiarioConfig.defaultFontSize;

    bitmap.textColor = color;
    bitmap.fontSize = size;
    bitmap.drawText(texto, 10, 10, width - 20, height - 20, 'left');

    this._textSprite = new Sprite(bitmap);
    this._textSprite.x = DiarioConfig.x;
    this._textSprite.y = DiarioConfig.y;

    this.addChild(this._textSprite);
  };

  Scene_DiarioDeCampo.prototype.update = function () {
    Scene_Base.prototype.update.call(this);
    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
  };

  // Lógica para abrir la escena
  const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("diarioDeCampo", this.commandDiarioDeCampo.bind(this));
  };

  Scene_Menu.prototype.commandDiarioDeCampo = function () {
    SceneManager.push(Scene_DiarioDeCampo);
  };
})();
