/*:
 * @plugindesc [v1.0] Abre una ventana personalizada con un comando de plugin. 
 * @author Luis
 *
 * @help
 * Comando de Plugin:
 *   OpenCustomWindow
 *
 * Este comando abre una ventana simple con un texto personalizado.
 * 
 */

(function() {
  // Comando de plugin
  const answerOptions = ["Cali", "Bogotá", "Cartagena"]; // Opciones a mostrar
  const correctAnswer = "Bogotá"; // Respuesta válida
  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Window_AnswerBox._anyDragging = false;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === 'OpenCustomWindow') {
      SceneManager.push(Scene_CustomWindow);
    }
  };

  // Escena personalizada
  function Scene_CustomWindow() {
    this.initialize.apply(this, arguments);
  }

  Scene_CustomWindow.prototype = Object.create(Scene_Base.prototype);
  Scene_CustomWindow.prototype.constructor = Scene_CustomWindow;

  Scene_CustomWindow.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_CustomWindow.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createWindow();
    this.createCloseButton();  //  Crea el botón "Cerrar" 
    this.createInputWindow();   //  Caja de entrada de texto 
    this.createAnswerBoxes(); // Crear cajas de opciones en la parte superior
    this.createResultWindow(); // Mostrar resultado de validación
    this._answeredCorrectly = false; //Bandera inicial para cerrar la ventana

  };






  Scene_CustomWindow.prototype.createResultWindow = function() {
    const width = 220;
    const height = 64;
    const x = (Graphics.boxWidth - width) / 2;
    const y = this._window.y - height +60; // encima de la ventana principal

    this._resultWindow = new Window_ResultMessage(x, y, width, height);
    this.addChild(this._resultWindow);

    // Guardar referencia global
    Scene_CustomWindow._resultWindow = this._resultWindow;
  };









  Scene_CustomWindow.prototype.createWindow = function() {
    const width = 800;
    const height = 600;
    const x = (Graphics.boxWidth - width) / 2;
    const y = (Graphics.boxHeight - height) / 2;

    this._window = new Window_Custom(x, y, width, height);
    this.addChild(this._window);
  };

  // Crea el botón "Cerrar" en la parte superior derecha de la ventana
  Scene_CustomWindow.prototype.createCloseButton = function() {
    const buttonWidth = 80;
    const buttonHeight = 36;
    //  Posición del botón en relación con la ventana
    const x = this._window.x + this._window.width - buttonWidth - 10;
    const y = this._window.y + 10;

    //  Creamos un sprite de botón
    this._closeButton = new Sprite_Button();

    //  Creamos el gráfico del botón con fondo blanco semitransparente
    this._closeButton.bitmap = new Bitmap(buttonWidth, buttonHeight);
    this._closeButton.bitmap.fillAll('rgba(255, 255, 255, 0.8)');
    this._closeButton.bitmap.textColor = '#FF0000';
    this._closeButton.bitmap.fontSize = 18;
    this._closeButton.bitmap.drawText("X", 0, 0, buttonWidth, buttonHeight, 'center');

    //  Establecemos la posición del sprite
    this._closeButton.x = x;
    this._closeButton.y = y;

    //  Al hacer clic en el botón, cierra la escena y reproduce sonido
    this._closeButton.setClickHandler(() => {
      if (this._answeredCorrectly) {
        SoundManager.playCancel();
        SceneManager.pop();
      } else {
        SoundManager.playBuzzer(); // Sonido de error si intenta cerrar sin responder bien
        // mostrar un mensaje
        this._resultWindow.setMessage("Debes responder correctamente", "#FFA500", 90);
      }
    });

    this.addChild(this._closeButton); //  Añadimos el botón a la escena
  };

  // Crear una ventana de entrada de texto justo debajo del texto central
  Scene_CustomWindow.prototype.createInputWindow = function() {
    const inputWidth = 160;
    const inputHeight = 70;

    const x = this._window.x + this._window.width - inputWidth - 20; //  derecha dentro de la ventana
    const y = this._window.y + 120; //  debajo del texto principal

    this._inputWindow = new Window_InputText(x, y, inputWidth, inputHeight);
    Scene_CustomWindow._inputBox = this._inputWindow; //Guardamos referencia global
    this.addChild(this._inputWindow);
  };


  Scene_CustomWindow.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
    //actualizar la ventana de resultado
    if (this._resultWindow) {
      this._resultWindow.update();
    }
  };

  // Crear 3 cajas de texto en la parte inferior de la ventana
  Scene_CustomWindow.prototype.createAnswerBoxes = function() {
    const boxWidth = 160;
    const boxHeight = 70;
    const spacing = 10;

    const totalWidth = answerOptions.length * boxWidth + (answerOptions.length - 1) * spacing;
    const startX = this._window.x + (this._window.width - totalWidth) / 2;

    // Nueva posición Y: justo debajo de la ventana
    const y = this._window.y + this._window.height - boxHeight - 20;;

    this._answerBoxes = [];
    for (let i = 0; i < answerOptions.length; i++) {

      const x = startX + i * (boxWidth + spacing);
      const box = new Window_AnswerBox(x, y, boxWidth, boxHeight, answerOptions[i]);

      // Guardar posición inicial
      box._initialX = x;
      box._initialY = y;

      this._answerBoxes.push(box);
      this.addChild(box);
    }

  };

  Scene_CustomWindow.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    //Bloquear salida si aún no se ha respondido correctamente
    if ((Input.isTriggered('cancel') || TouchInput.isCancelled()) && this._answeredCorrectly) {
      SoundManager.playCancel();
      SceneManager.pop();
    } else if ((Input.isTriggered('cancel') || TouchInput.isCancelled()) && !this._answeredCorrectly) {
      SoundManager.playBuzzer();
      this._resultWindow.setMessage("Responde correctamente para salir", "#FFA500", 90);
    }

    if (this._resultWindow) {
      this._resultWindow.update();
    }
  };
    


  // Ventana personalizada
  function Window_Custom() {
    this.initialize.apply(this, arguments);
  }

  Window_Custom.prototype = Object.create(Window_Base.prototype);
  Window_Custom.prototype.constructor = Window_Custom;

  Window_Custom.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.drawText("¡Desliza la respuesta corecta al campo correspondiente!", 0, this.lineHeight(), this.contentsWidth(), 'center');

    //  Pregunta (alineada a la izquierda, debajo)
    const pregunta = "¿Cuál es la capital de Colombia?";
    this.drawText(pregunta, 10, this.lineHeight() * 3, this.contentsWidth() - 20, 'left');
  };



  //  Ventana de entrada de texto simple
  function Window_InputText() {
    this.initialize.apply(this, arguments);
  }


  

  Window_InputText.prototype = Object.create(Window_Base.prototype);
  Window_InputText.prototype.constructor = Window_InputText;

  Window_InputText.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._text = ""; // Almacena lo que escribe el jugador
    this._cursorIndex = 0;
    this.refresh();
    this.activate();
  };

  Window_InputText.prototype.setText = function(text) {
        this._text = text;
        this.refresh();
      };

  Window_InputText.prototype.refresh = function() {
    this.contents.clear();
    this.changeTextColor(this._color || '#FFFFFF');
    this.drawText(this._text, 0, 0, this.contentsWidth(), 'left');
  };

  Window_InputText.prototype.update = function() {
    Window_Base.prototype.update.call(this);

    //  Detecta entrada de teclas alfabéticas
    for (let i = 65; i <= 90; i++) {
      if (Input.isTriggered(String.fromCharCode(i).toLowerCase())) {
        this._text += String.fromCharCode(i);
        this.refresh();
      }
    }

    //  Detecta espacio
    if (Input.isTriggered('space')) {
      this._text += ' ';
      this.refresh();
    }

    //  Retroceso
    if (Input.isTriggered('backspace')) {
      this._text = this._text.slice(0, -1);
      this.refresh();
    }
  };

  // Ventana individual para mostrar una palabra
  function Window_AnswerBox() {
  this.initialize.apply(this, arguments);
}

Window_AnswerBox.prototype = Object.create(Window_Base.prototype);
Window_AnswerBox.prototype.constructor = Window_AnswerBox;

Window_AnswerBox.prototype.initialize = function(x, y, width, height, text) {
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this._text = text;
  this._dragging = false; // Estado de arrastre
  this.refresh();
  this.deactivate(); // No necesita foco
};

Window_AnswerBox.prototype.refresh = function() {
  this.contents.clear();
 
  this.changeTextColor('#FFFFFF');
  this.drawText(this._text, 0, 0, this.contentsWidth(), 'center');
};

Window_AnswerBox.prototype.update = function() {
  Window_Base.prototype.update.call(this);

  const mouseX = TouchInput.x;
  const mouseY = TouchInput.y;
  const inside = this.hitTest(mouseX, mouseY);

  if (TouchInput.isPressed() && inside && !this._dragging && !Window_AnswerBox._anyDragging) {
    this._dragging = true;
    Window_AnswerBox._anyDragging = true;
    this._dragOffsetX = mouseX - this.x;
    this._dragOffsetY = mouseY - this.y;
    this.opacity = 180;
  }

  if (this._dragging) {
    this.x = mouseX - this._dragOffsetX;
    this.y = mouseY - this._dragOffsetY;

    if (!TouchInput.isPressed()) {
      this._dragging = false;
      Window_AnswerBox._anyDragging = false;
      this.opacity = 255;

      //  Detectar colisión con el campo de texto
      const input = Scene_CustomWindow._inputBox;
      if (this.collidesWith(input)) {
        input.setText(this._text); // Inserta el texto en el campo




        if (this._text === correctAnswer) {
          Scene_CustomWindow._resultWindow.setMessage("✔ Correcto", "#00FF00", 90);
          SoundManager.playOk();
          //respondido correctamente
          SceneManager._scene._answeredCorrectly = true;
        } else {
          Scene_CustomWindow._resultWindow.setMessage("✖ Incorrecto", "#FF0000", 90);
          SoundManager.playBuzzer();
        }




        // Regresar a su posición original
        this.x = this._initialX;
        this.y = this._initialY;
      }
    }
  }
};

//  Método que verifica si esta caja se suelta encima de otra ventana
Window_AnswerBox.prototype.collidesWith = function(otherWindow) {
  const ax1 = this.x, ay1 = this.y;
  const ax2 = this.x + this.width, ay2 = this.y + this.height;

  const bx1 = otherWindow.x, by1 = otherWindow.y;
  const bx2 = otherWindow.x + otherWindow.width, by2 = otherWindow.y + otherWindow.height;

  return !(ax2 < bx1 || ax1 > bx2 || ay2 < by1 || ay1 > by2);
};


// Verifica si el puntero está dentro del área de esta caja
Window_AnswerBox.prototype.hitTest = function(x, y) {
  const left = this.x;
  const top = this.y;
  const right = this.x + this.width;
  const bottom = this.y + this.height;
  return x >= left && x <= right && y >= top && y <= bottom;
};







// Ventana que muestra "Correcto" o "Incorrecto"
function Window_ResultMessage() {
  this.initialize.apply(this, arguments);
}

Window_ResultMessage.prototype = Object.create(Window_Base.prototype);
Window_ResultMessage.prototype.constructor = Window_ResultMessage;

Window_ResultMessage.prototype.initialize = function(x, y, width, height) {
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.openness = 0; //  Oculta al inicio
  this._message = "";
  this._duration = 0;
};

Window_ResultMessage.prototype.setMessage = function(text, color, duration = 90) {
  this._message = text;
  this._color = color;
  this._duration = duration; // cuántos frames se muestra
  this.refresh();
  this.open(); // Abre el popup
};

Window_ResultMessage.prototype.refresh = function() {
  this.contents.clear();
  this.changeTextColor(this._color || '#FFFFFF');
  this.drawText(this._message, 0, 0, this.contentsWidth(), 'center');
};

Window_ResultMessage.prototype.update = function() {
  Window_Base.prototype.update.call(this);

  if (this._duration > 0) {
    this._duration--;
    if (this._duration === 0) {
      this.close(); //  Oculta automáticamente
    }
  }
};

})();
