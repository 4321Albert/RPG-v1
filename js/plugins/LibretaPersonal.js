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
    backgroundColor: "rgba(255, 253, 253, 1)",
    defaultTextColor: "#000000",
    defaultFontSize: 15,
     variableId: 9
  };

  const Box1 = {
    x: 130,
    y: 133,
    width: 100,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 1)",
    defaultTextColor: "#000000",
    defaultFontSize: 15,
    variableId: 10
  };

  // Configuración para las nuevas cajas 
  const AdditionalBoxes = [
    { x: 240, y: 133, width: 45, height: 28, variableId: 11 }, //3
    { x: 320, y: 133, width: 55, height: 28, variableId: 12 }, //4
    { x: 420, y: 133, width: 55, height: 28, variableId: 13 }, //5
    { x: 510, y: 133, width: 55, height: 28, variableId: 14 }, //6
    { x: 595, y: 133, width: 55, height: 28, variableId: 15 }, //7
    { x: 665, y: 133, width: 55, height: 28, variableId: 16 }, //8
    { x: 745, y: 133, width: 65, height: 28, variableId: 17 }, //9
    
    { x: 6, y: 165, width: 118, height: 28, variableId: 18 }, //10
    { x: 130, y: 165, width: 100, height: 28, variableId: 19 }, //11
    { x: 240, y: 165, width: 45, height: 28, variableId: 20 }, //12
    { x: 320, y: 165, width: 55, height: 28, variableId: 21 }, //13
    { x: 420, y: 165, width: 55, height: 28, variableId: 22 }, //13
    { x: 510, y: 165, width: 55, height: 28, variableId: 23 },
    { x: 595, y: 165, width: 55, height: 28, variableId: 24 },
    { x: 665, y: 165, width: 55, height: 28, variableId: 25 }, //3
    { x: 745, y: 165, width: 65, height: 28, variableId: 26 }, //4

    { x: 6, y: 198, width: 118, height: 28, variableId: 27 }, 
    { x: 130, y: 198, width: 100, height: 28, variableId: 28 }, 
    { x: 240, y: 198, width: 45, height: 28, variableId: 29 }, 
    { x: 320, y: 198, width: 55, height: 28, variableId: 30 },
    { x: 420, y: 198, width: 55, height: 28, variableId: 31 },
    { x: 510, y: 198, width: 55, height: 28, variableId: 32 },
    { x: 595, y: 198, width: 55, height: 28, variableId: 33 },
    { x: 665, y: 198, width: 55, height: 28, variableId: 34 }, 
    { x: 745, y: 198, width: 65, height: 28, variableId: 35 }, 

    { x: 6, y: 231, width: 118, height: 28, variableId: 36 }, 
    { x: 130, y: 231, width: 100, height: 28, variableId: 37 }, 
    { x: 240, y: 231, width: 45, height: 28, variableId: 38 }, 
    { x: 320, y: 231, width: 55, height: 28, variableId: 39 },
    { x: 420, y: 231, width: 55, height: 28, variableId: 40 },
    { x: 510, y: 231, width: 55, height: 28, variableId: 41 },
    { x: 595, y: 231, width: 55, height: 28, variableId: 42 },
    { x: 665, y: 231, width: 55, height: 28, variableId: 43 }, 
    { x: 745, y: 231, width: 65, height: 28, variableId: 44 },

    { x: 6, y: 264, width: 118, height: 28, variableId: 45 }, 
    { x: 130, y: 264, width: 100, height: 28, variableId: 46 }, 
    { x: 240, y: 264, width: 45, height: 28, variableId: 47 }, 
    { x: 320, y: 264, width: 55, height: 28, variableId: 48 },
    { x: 420, y: 264, width: 55, height: 28, variableId: 49 },
    { x: 510, y: 264, width: 55, height: 28, variableId: 50 },
    { x: 595, y: 264, width: 55, height: 28, variableId: 51 },
    { x: 665, y: 264, width: 55, height: 28, variableId: 52 }, 
    { x: 745, y: 264, width: 65, height: 28, variableId: 53 },

    { x: 6, y: 297, width: 118, height: 28, variableId: 54 }, 
    { x: 130, y: 297, width: 100, height: 28, variableId: 55 }, 
    { x: 240, y: 297, width: 45, height: 28, variableId: 56 }, 
    { x: 320, y: 297, width: 55, height: 28, variableId: 57 },
    { x: 420, y: 297, width: 55, height: 28, variableId: 58 },
    { x: 510, y: 297, width: 55, height: 28, variableId: 59 },
    { x: 595, y: 297, width: 55, height: 28, variableId: 60 },
    { x: 665, y: 297, width: 55, height: 28, variableId: 61 }, 
    { x: 745, y: 297, width: 65, height: 28, variableId: 62 },

    { x: 6, y: 330, width: 118, height: 28, variableId: 63 }, 
    { x: 130, y: 330, width: 100, height: 28, variableId: 64 }, 
    { x: 240, y: 330, width: 45, height: 28, variableId: 65 }, 
    { x: 320, y: 330, width: 55, height: 28, variableId: 66 },
    { x: 420, y: 330, width: 55, height: 28, variableId: 67 },
    { x: 510, y: 330, width: 55, height: 28, variableId: 68 },
    { x: 595, y: 330, width: 55, height: 28, variableId: 69 },
    { x: 665, y: 330, width: 55, height: 28, variableId: 70 }, 
    { x: 745, y: 330, width: 65, height: 28, variableId: 71 },

    { x: 6, y: 363, width: 118, height: 28, variableId: 72 }, 
    { x: 130, y: 363, width: 100, height: 28, variableId: 73 }, 
    { x: 240, y: 363, width: 45, height: 28, variableId: 74 }, 
    { x: 320, y: 363, width: 55, height: 28, variableId: 75 },
    { x: 420, y: 363, width: 55, height: 28, variableId: 76 },
    { x: 510, y: 363, width: 55, height: 28, variableId: 77 },
    { x: 595, y: 363, width: 55, height: 28, variableId: 78 },
    { x: 665, y: 363, width: 55, height: 28, variableId: 79 }, 
    { x: 745, y: 363, width: 65, height: 28, variableId: 80 },

    { x: 6, y: 396, width: 118, height: 28, variableId: 81 }, 
    { x: 130, y: 396, width: 100, height: 28, variableId: 82 }, 
    { x: 240, y: 396, width: 45, height: 28, variableId: 83 }, 
    { x: 320, y: 396, width: 55, height: 28, variableId: 84 },
    { x: 420, y: 396, width: 55, height: 28, variableId: 85 },
    { x: 510, y: 396, width: 55, height: 28, variableId: 86 },
    { x: 595, y: 396, width: 55, height: 28, variableId: 87 },
    { x: 665, y: 396, width: 55, height: 28, variableId: 88 }, 
    { x: 745, y: 396, width: 65, height: 28, variableId: 89 },
    // Línea 5 (Y = 429)
    { x: 6, y: 429, width: 118, height: 28, variableId: 90 }, 
    { x: 130, y: 429, width: 100, height: 28, variableId: 91 }, 
    { x: 240, y: 429, width: 45, height: 28, variableId: 92 }, 
    { x: 320, y: 429, width: 55, height: 28, variableId: 93 },
    { x: 420, y: 429, width: 55, height: 28, variableId: 94 },
    { x: 510, y: 429, width: 55, height: 28, variableId: 95 },
    { x: 595, y: 429, width: 55, height: 28, variableId: 96 },
    { x: 665, y: 429, width: 55, height: 28, variableId: 97 }, 
    { x: 745, y: 429, width: 65, height: 28, variableId: 98 },

    // Línea 6 (Y = 462)
    { x: 6, y: 462, width: 118, height: 28, variableId: 99 }, 
    { x: 130, y: 462, width: 100, height: 28, variableId: 100 }, 
    { x: 240, y: 462, width: 45, height: 28, variableId: 101 }, 
    { x: 320, y: 462, width: 55, height: 28, variableId: 102 },
    { x: 420, y: 462, width: 55, height: 28, variableId: 103 },
    { x: 510, y: 462, width: 55, height: 28, variableId: 104 },
    { x: 595, y: 462, width: 55, height: 28, variableId: 105 },
    { x: 665, y: 462, width: 55, height: 28, variableId: 106 }, 
    { x: 745, y: 462, width: 65, height: 28, variableId: 107 },

    // Línea 7 (Y = 495)
    { x: 6, y: 495, width: 118, height: 28, variableId: 108 }, 
    { x: 130, y: 495, width: 100, height: 28, variableId: 109 }, 
    { x: 240, y: 495, width: 45, height: 28, variableId: 110 }, 
    { x: 320, y: 495, width: 55, height: 28, variableId: 111 },
    { x: 420, y: 495, width: 55, height: 28, variableId: 112 },
    { x: 510, y: 495, width: 55, height: 28, variableId: 113 },
    { x: 595, y: 495, width: 55, height: 28, variableId: 114 },
    { x: 665, y: 495, width: 55, height: 28, variableId: 115 }, 
    { x: 745, y: 495, width: 65, height: 28, variableId: 116 },

    // Línea 8 (Y = 528)
    { x: 6, y: 528, width: 118, height: 28, variableId: 117 }, 
    { x: 130, y: 528, width: 100, height: 28, variableId: 118 }, 
    { x: 240, y: 528, width: 45, height: 28, variableId: 119 }, 
    { x: 320, y: 528, width: 55, height: 28, variableId: 120 },
    { x: 420, y: 528, width: 55, height: 28, variableId: 121 },
    { x: 510, y: 528, width: 55, height: 28, variableId: 122 },
    { x: 595, y: 528, width: 55, height: 28, variableId: 123 },
    { x: 665, y: 528, width: 55, height: 28, variableId: 124 }, 
    { x: 745, y: 528, width: 65, height: 28, variableId: 125 },

    // Línea 9 (Y = 561)
    { x: 6, y: 561, width: 118, height: 28, variableId: 126 }, 
    { x: 130, y: 561, width: 100, height: 28, variableId: 127 }, 
    { x: 240, y: 561, width: 45, height: 28, variableId: 128 }, 
    { x: 320, y: 561, width: 55, height: 28, variableId: 129 },
    { x: 420, y: 561, width: 55, height: 28, variableId: 130 },
    { x: 510, y: 561, width: 55, height: 28, variableId: 131 },
    { x: 595, y: 561, width: 55, height: 28, variableId: 132 },
    { x: 665, y: 561, width: 55, height: 28, variableId: 133 }, 
    { x: 745, y: 561, width: 65, height: 28, variableId: 134 },


    { x: 6, y: 594, width: 118, height: 28, variableId: 135 }, 
    { x: 130, y: 594, width: 100, height: 28, variableId: 136 }, 
    { x: 240, y: 594, width: 45, height: 28, variableId: 137 },
    { x: 320, y: 594, width: 55, height: 28, variableId: 138 },
    { x: 420, y: 594, width: 55, height: 28, variableId: 139 },
    { x: 510, y: 594, width: 55, height: 28, variableId: 140 },
    { x: 595, y: 594, width: 55, height: 28, variableId: 141 },
    { x: 665, y: 594, width: 55, height: 28, variableId: 142 }, 
    { x: 745, y: 594, width: 65, height: 28, variableId: 143 }

  ].map(box => ({
    ...box,
    backgroundColor: "rgba(252, 250, 250, 1)",
    defaultTextColor: "#000000",
    defaultFontSize: 15
  }));

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
    this.createVariableBoxes(); // Crea todas las cajas de variables
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

    
    const texto = $gameSystem._diarioTexto || "Habitantes.";
    const color = $gameSystem._diarioTextoColor || DiarioConfig.defaultTextColor;
    const size = $gameSystem._diarioTextoSize || DiarioConfig.defaultFontSize;

    bitmap.textColor = color;
    bitmap.fontSize = size;
    bitmap.outlineColor = 'rgba(10, 10, 10, 0)';
    bitmap.outlineWidth = 0;
    bitmap.drawText(texto, 10, 10, width - 20, height - 20, 'left');

    this._textSprite = new Sprite(bitmap);
    this._textSprite.x = DiarioConfig.x;
    this._textSprite.y = DiarioConfig.y;

    this.addChild(this._textSprite);
  };

  Scene_MatrizHabitantes.prototype.createVariableBoxes = function() {
    // Caja original (variable 10)
    this.createSingleVariableBox(Box1);
    this.createSingleVariableBox( DiarioConfig)
    
    // Cajas adicionales (variables 11-17)
    AdditionalBoxes.forEach(config => {
      this.createSingleVariableBox(config);
    });
  };

  Scene_MatrizHabitantes.prototype.createSingleVariableBox = function(config) {
    const bitmap = new Bitmap(config.width, config.height);

    // Fondo
    bitmap.fillRect(0, 0, config.width, config.height, config.backgroundColor);

    // Texto desde la variable correspondiente
    const variableValue = $gameVariables.value(config.variableId);
    const texto = variableValue !== undefined ? variableValue.toString() : "Vacío";
    const textoColor = config.defaultTextColor;
    const textoSize = config.defaultFontSize;

    bitmap.textColor = textoColor;
    bitmap.fontSize = textoSize;
    bitmap.outlineColor = 'rgba(11, 11, 11, 0.25)';
    bitmap.outlineWidth = 0;
    bitmap.drawText(texto, 10, 10, config.width - 20, config.height - 20, 'left');

    const boxSprite = new Sprite(bitmap);
    boxSprite.x = config.x;
    boxSprite.y = config.y;

    this.addChild(boxSprite);
};

  Scene_MatrizHabitantes.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
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