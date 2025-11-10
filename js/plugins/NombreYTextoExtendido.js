/*:
 * @plugindesc Aumenta el límite de líneas por mensaje y muestra el nombre del hablante debajo del cuadro de texto. [v1.2] (corregido)
 * @author Luis
 * 
 * @help
 * Usa \n<Nombre> para mostrar el nombre del hablante.
 * Usa \fs[20] para cambiar el tamaño del texto.
 * Soporta hasta 8 líneas por mensaje.
 */

(function() {

  // Configurar número de líneas visibles
  const maxLines = 8;

  // Sobrescribe el número de líneas visibles en el mensaje
  Window_Message.prototype.numVisibleRows = function() {
    return maxLines;
  };

  // Aumenta el tamaño del buffer de mensajes (por defecto es 4)
  const _Game_Message_clear = Game_Message.prototype.clear;
  Game_Message.prototype.clear = function() {
    _Game_Message_clear.call(this);
    this._texts = [];
  };

  Game_Message.prototype.add = function(text) {
    this._texts.push(text);
  };

  Game_Message.prototype.allText = function() {
    return this._texts.join('\n');
  };

  // Ventana de nombre personalizada
  function Window_NameDisplay() {
    this.initialize.apply(this, arguments);
  }

  Window_NameDisplay.prototype = Object.create(Window_Base.prototype);
  Window_NameDisplay.prototype.constructor = Window_NameDisplay;

  Window_NameDisplay.prototype.initialize = function() {
    const width = 240;
    const height = this.fittingHeight(1);
    const x = 0;
    const y = Graphics.boxHeight - this.fittingHeight(maxLines) + this.fittingHeight(1); // Debajo del mensaje
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._name = '';
    this.openness = 0;
    this.contents.fontSize = 20;
  };

  Window_NameDisplay.prototype.setName = function(name) {
    this._name = name;
    this.refresh();
  };

  Window_NameDisplay.prototype.refresh = function() {
    this.contents.clear();
    this.drawText(this._name, 0, 0, this.contentsWidth(), 'left');
  };

  // Añadir ventana de nombre a la escena
  const _Scene_Map_createMessageWindow = Scene_Map.prototype.createMessageWindow;
  Scene_Map.prototype.createMessageWindow = function() {
    _Scene_Map_createMessageWindow.call(this);
    this._nameWindow = new Window_NameDisplay();
    this.addWindow(this._nameWindow);
    this._messageWindow._nameWindow = this._nameWindow;
  };

  // Capturar el nombre en el texto
  const _Window_Message_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function() {
    if (this._textState && this._textState.text) {
      const text = this._textState.text;
      const nameMatch = text.match(/\\n<([^>]+)>/i);
      if (nameMatch) {
        const name = nameMatch[1];
        this._textState.text = text.replace(/\\n<[^>]+>\n?/i, '');
        if (this._nameWindow) {
          this._nameWindow.setName(name);
          this._nameWindow.open();
        }
      } else if (this._nameWindow) {
        this._nameWindow.close();
      }
    }
    _Window_Message_startMessage.call(this);
  };

  // Ocultar ventana de nombre al pasar de página
  const _Window_Message_newPage = Window_Message.prototype.newPage;
  Window_Message.prototype.newPage = function(textState) {
    _Window_Message_newPage.call(this, textState);
    if (this._nameWindow) this._nameWindow.hide();
  };

})();
