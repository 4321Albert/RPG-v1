/*:
 * @plugindesc [v1.0] Minijuego base con comando de activación desde evento. 
 * @author Luis
 *
 * @help
 * Comando de evento para activar el minijuego:
 *     StartMiniGame
 *
 * 
 */

(function() {

  
    //funcion para comando de pluging
  Object.defineProperty(window, '_llevacuentas', {
    get: function() {
      return $gameVariables.value(148);
    },
    set: function(value) {
      $gameVariables.setValue(148, value);
    }
  
});

  let _finalScore = 175; // puntaje final a comulado
  let _gamePassed = false;
  
   
  
           

  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;



    // Extiende Game_System para guardar si ya pasó la prueba
  Game_System.prototype.hapasadoEljuego = function() {
    return this._miniGamePassedd === true;
  };

  Game_System.prototype.definirPasadoJuego = function(passed) {
    this._miniGamePassedd = passed;
  };

  // Verifica si el juego está bloqueado
  Game_System.prototype.sebloquioElJuego = function() {
    return this._miniGameLockedd === true;
  };
  Game_System.prototype.definirBloqueoDeJUego = function(locked) {
    this._miniGameLockedd = locked;
  };


  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    //funcion para comando de pluging
    if (command === "IniciarPruebaVigilancia") {
      // Verificar si el juego está bloqueado
      if ($gameSystem.sebloquioElJuego()) {
        //SceneManager.push(Scene_GameLocked);
        return;
      }
      if ($gameSystem.hapasadoEljuego()) {
        alert("⚠️ Ya no puedes volver a presentar la prueba. Ya sacaste el mayor puntaje.");
        return;
      }
      if ($gameVariables.value(149)===0) {
        $gameVariables.setValue(149, 10)
        
      }
  

      if ($gameVariables.value(148) === 0) {
        $gameVariables.setValue(148, 10);
      }

      SceneManager.push(Scene_Vigilancia);
   }

  };
//funcion para comando de pluging
  function Scene_Vigilancia() {
    this.initialize.apply(this, arguments);
  }

  
//funcion para comando de pluging
  Scene_Vigilancia.prototype = Object.create(Scene_Base.prototype);
  Scene_Vigilancia.prototype.constructor = Scene_Vigilancia;
//funcion para comando de pluging
  Scene_Vigilancia.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };
//funcion para ejecutar las funciones
  Scene_Vigilancia.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    
    this.createImageWindow();
    this.createDraggableNumbers();
    this.createDropBoxes();
    this.createConsultaButton();
    this.createBottomButtons();
    this.createScoreBox();
    this.createFinalScoreBox();
    this.createInfoButton();
    this.crearElementosDeTexto();

  };
  //funcion para comando de pluging
  Scene_Vigilancia.prototype.update = function() {
  Scene_Base.prototype.update.call(this);
  this.updateDragAndDrop();

  if (Input.isTriggered('cancel')) {
    SceneManager.pop();
  }
};

Scene_Vigilancia.prototype.updateDragAndDrop = function() {
  if (TouchInput.isTriggered()) {
    for (let sprite of this._draggableNumbers) {
      const x = TouchInput.x;
      const y = TouchInput.y;
      if (x >= sprite.x && x <= sprite.x + sprite.width &&
          y >= sprite.y && y <= sprite.y + sprite.height) {
        this._currentDragged = sprite;
        sprite._dragging = true;
        break;
      }
    }
  }

  if (TouchInput.isPressed() && this._currentDragged) {
    const sprite = this._currentDragged;
    sprite.x = TouchInput.x - sprite.width / 2;
    sprite.y = TouchInput.y - sprite.height / 2;

    //this.resaltarCajasValidas(sprite._valor);
  }

  if (TouchInput.isReleased() && this._currentDragged) {
    const sprite = this._currentDragged;
    sprite._dragging = false;
    this.tryDrop(sprite);
    this._currentDragged = null;
  }
};





  //VENTANA DE ENLACES 
  Scene_Vigilancia.prototype.openConsultaWindow = function() {
  if (this._consultaWindow) {
    this.removeChild(this._consultaWindow);
    this._consultaWindow = null;
    return;
  }

  const width = 500;
  const height = 300;
  const windowSprite = new Sprite(new Bitmap(width, height));
  windowSprite.bitmap.fillRect(0, 0, width, height, '#f1f3f4ff');
  windowSprite.x = (Graphics.width - width) / 2;
  windowSprite.y = (Graphics.height - height) / 2;

  // Crear botón de cerrar [X]
  const closeButton = new Sprite(new Bitmap(40, 40));
  closeButton.bitmap.fillRect(0, 0, 40, 40, '#ff4444');
  closeButton.bitmap.drawText("X", 0, 0, 40, 40, 'center');
  closeButton.x = width - 45;
  closeButton.y = 5;

  closeButton.update = function() {
    Sprite.prototype.update.call(this);
    if (TouchInput.isTriggered()) {
      const x = TouchInput.x;
      const y = TouchInput.y;
      const globalX = windowSprite.x + this.x;
      const globalY = windowSprite.y + this.y;
      if (x >= globalX && x <= globalX + this.width &&
          y >= globalY && y <= globalY + this.height) {
        SceneManager._scene.removeChild(windowSprite);
        SceneManager._scene._consultaWindow = null;
      }
    }
  };

  windowSprite.addChild(closeButton);


  const links = [
    { label: "Video explicación", url: "https://www.youtube.com/watch?v=zCcxZvmjnw0" }
    // Puedes agregar más enlaces aquí
  ];

  links.forEach((link, index) => {
      const linkWidth = width - 20;
  const linkHeight = 40;
  const linkSprite = new Sprite(new Bitmap(linkWidth, linkHeight));

  linkSprite._url = link.url;
  linkSprite._label = link.label;
  linkSprite._normalColor = "#070707ff";   
  linkSprite._hoverColor = "#a5cef7ff";    
  linkSprite._isHovered = false;

  //  Dibujar el texto del enlace
  const drawLink = (color) => {
    linkSprite.bitmap.clear();
    linkSprite.bitmap.textColor = color;
    linkSprite.bitmap.drawText(link.label, 0, 0, linkWidth, linkHeight, 'left');
  };

  drawLink(linkSprite._normalColor);

  linkSprite.x = 10;
  linkSprite.y = 50 + index * 45;

  // Detectar hover y clic
  linkSprite.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;
    const globalX = windowSprite.x + this.x;
    const globalY = windowSprite.y + this.y;

    const hovered =
      x >= globalX && x <= globalX + this.width &&
      y >= globalY && y <= globalY + this.height;

    if (hovered !== this._isHovered) {
      this._isHovered = hovered;
      drawLink(hovered ? this._hoverColor : this._normalColor);
    }

    if (TouchInput.isTriggered() && hovered) {
      window.open(this._url, '_blank');
    }
  };

  windowSprite.addChild(linkSprite);
  });

  this._consultaWindow = windowSprite;
  this.addChild(windowSprite);
};

  //METODOS DEL PLUGING

  //funcion mostrar mas informacion 
  Scene_Vigilancia.prototype.createInfoButton = function() {
  const buttonWidth = 150;
  const buttonHeight = 40;
  const buttonX = 50; 
  const buttonY = 50;

  // Crear el botón
  const infoButton = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  infoButton._normalColor = '#dedadaff';
  infoButton._hoverColor = '#b1d5faff';
  infoButton._textColor = '#3a3939ff';
  infoButton._isHovered = false;

  const drawButton = (bgColor, textColor) => {
    infoButton.bitmap.clear();
    infoButton.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, bgColor);
    infoButton.bitmap.textColor = textColor;
    infoButton.bitmap.fontFace = 'Arial';
    infoButton.bitmap.outlineWidth = 0;
    infoButton.bitmap.fontSize =18;
    //infoButton.bitmap.textColor = "#000000";
    infoButton.bitmap.drawText("Mas Información", 5, 5, buttonWidth, buttonHeight, 'left');
  };

  drawButton(infoButton._normalColor, infoButton._textColor);

  infoButton.x = buttonX;
  infoButton.y = buttonY;

  // Crear el cuadro de texto emergente
  const tooltip = new Sprite(new Bitmap(450, 200));
  const bmp = tooltip.bitmap;
  bmp.outlineColor = 'rgba(0, 0, 0, 0)'; // Sin color de contorno
  bmp.outlineWidth = 0;                 // Ancho del contorno = 0


  tooltip.bitmap.textColor = "#000000";
  tooltip.bitmap.fillRect(0, 0, 390, 130, "#ffffe0"); // fondo amarillo claro
  //tooltip.bitmap.textColor = "#000000";
  tooltip.bitmap.fontSize = 15; //  tamaño del texto

const lines = [
  "Puedes hacer clic en Referencias",
  "o en salir sin finalizar",
  "para consultar tus notas de estudio,",
  "diario de campo u otros documentos",
  "que te permitan tener más certeza en tu respuesta."
];

for (let i = 0; i < lines.length; i++) {
  tooltip.bitmap.drawText(lines[i], 10, i * 22, 430, 30, 'left');
}
  tooltip.x = infoButton.x + buttonWidth + 10;
  tooltip.y = infoButton.y;
  tooltip.visible = false;

  // Lógica de interacción
  infoButton.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    const hovered = (
      x >= this.x && x <= this.x + this.width &&
      y >= this.y && y <= this.y + this.height
    );

    if (hovered !== this._isHovered) {
      this._isHovered = hovered;
      drawButton(hovered ? this._hoverColor : this._normalColor, this._textColor);
      tooltip.visible = hovered;
    }
  };

  this.addChild(infoButton);
  this.addChild(tooltip);
};


  //funcion mostrar puntaje de la tarea 2
  Scene_Vigilancia.prototype.createFinalScoreBox = function() {
  const finalScoreBox = new Sprite(new Bitmap(300, 40));
  finalScoreBox.x = 599;  // Cambiar la posición
  finalScoreBox.y = 50;

  finalScoreBox.bitmap.fillRect(0, 0, 190, 40, "#f5d1b4ff"); 
  finalScoreBox.bitmap.textColor = "#000000";
  finalScoreBox.bitmap.fontFace = 'Arial';
  finalScoreBox.bitmap.outlineWidth = 0;
  const vida = $gameVariables.value(4);
  finalScoreBox.bitmap.fontSize =18;
  finalScoreBox.bitmap.drawText("Puntaje Tarea 2: " + vida, 0, 0, 250, 40, 'left');

  this._finalScoreBox = finalScoreBox;
  this.addChild(finalScoreBox);
};

    //Mostrar el puntaje en pantalla
  Scene_Vigilancia.prototype.createScoreBox = function() {
  const scoreBox = new Sprite(new Bitmap(250, 40));
  scoreBox.x = 371;
  scoreBox.y = 50;

 
  scoreBox.bitmap.fillRect(0, 0, 200, 40, "#f2c298ff");
  scoreBox.bitmap.textColor = "#000000";
  scoreBox.bitmap.fontFace = 'Arial';
  scoreBox.bitmap.outlineWidth = 0;
  scoreBox.bitmap.fontSize = 18;
  scoreBox.bitmap.drawText("Puntaje actividad: " + _llevacuentas, 0, 0, 250, 40, 'left');


  this._scoreBox = scoreBox;
  this.addChild(scoreBox);
};

  //Metodo de validacion 
  Scene_Vigilancia.prototype.checkAllBoxesFilled = function() {
  const allFilled = this._dropBoxes.every(box => box._occupied);
  if (!allFilled) return;

  const groups = this.getBoxGroups();
  let valid = true;

  for (let g = 0; g < groups.length; g++) {
    const expectedNumbers = groups[g]; // Ej: [2,6]
    const box1 = this._dropBoxes[g * 2];
    const box2 = this._dropBoxes[g * 2 + 1];

    const entered = [box1._currentNumber, box2._currentNumber];

    // Validar si los dos números ingresados están en el conjunto correcto
    if (
      !expectedNumbers.includes(entered[0]) ||
      !expectedNumbers.includes(entered[1]) ||
      entered[0] === entered[1]
    ) {
      valid = false;
      break;
    }
  }

  
};


  //metod del boton de enlaces
  Scene_Vigilancia.prototype.createConsultaButton = function() {
  const buttonX = 225;  
  const buttonY = 50;  
  const buttonWidth = 115;
  const buttonHeight = 40;

  const button = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  button._normalColor = '#fcdbcfff';    
  button._hoverColor = '#b8dbfaff';     
  button._textColor = '#353434ff';      

  button._isHovered = false;

  //  Estilo inicial
  const drawButton = (bgColor, textColor) => {
    button.bitmap.clear();

    // Fondo con esquinas redondeadas simuladas
    button.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, bgColor);
    button.bitmap.textColor = textColor;
    button.bitmap.fontFace = 'Arial';
    button.bitmap.outlineWidth = 0;
    button.bitmap.fontSize =18;
    button.bitmap.drawText("Referencias", 5, 5, buttonWidth, buttonHeight, 'left');

    // Simulación de bordes redondeados: sombra
    button.bitmap.gradientFillRect(0, buttonHeight - 4, buttonWidth, 4, "#00000044", "#00000000", true);
  };

  drawButton(button._normalColor, button._textColor);

  button.x = buttonX;
  button.y = buttonY;

  // Manejador de clic
  button.setClickHandler = () => {
    this.openConsultaWindow();
  };

  // Manejo visual y de interacción
  button.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    const hovered = (
      x >= this.x && x <= this.x + this.width &&
      y >= this.y && y <= this.y + this.height
    );

    if (hovered !== this._isHovered) {
      this._isHovered = hovered;
      drawButton(
        hovered ? this._hoverColor : this._normalColor,
        this._textColor
      );
    }

    if (TouchInput.isTriggered() && hovered) {
      this.setClickHandler();
    }
  };

  this._consultaButton = button;
  this.addChild(button);
};


//funcion para crear la imagen en la ventana
 Scene_Vigilancia.prototype.createImageWindow = function() {
  const sprite = new Sprite();
  const bitmap = ImageManager.loadBitmap('img/img_pluging/', 'vigilancia');

  bitmap.addLoadListener(() => {
    // Escalar la imagen al tamaño de la pantalla
    sprite.bitmap = bitmap;
    sprite.scale.x = Graphics.width / bitmap.width;
    sprite.scale.y = Graphics.height / bitmap.height;
    sprite.x = 0;
    sprite.y = 0;
  });

  this.addChild(sprite);
 };




Scene_Vigilancia.prototype.crearElementosDeTexto = function() {
  this._elementos = [];
        
const variables = ['Pregunta 1: ¿Cuál de las situaciones representa un ejemplo de vigilancia pasiva?', 'Pregunta 2: ¿Cuál de las situaciones representa un ejemplo de vigilancia activa?', 'Pregunta 3:  ¿Cuál de las situaciones  representa un ejemplo de vigilancia centinela?', 'Se seleccionan tres clínicas para seguimiento de síntomas.', 'Una brigada recorre casas buscando casos de fiebre.', 'Esperar a que los pacientes lleguen al hospital.', 'Informes automáticos de laboratorio.', 'Se realiza una encuesta especial por un brote.', 'Alistamiento del material quirúrgico.', 'Personal de salud visitando casa por casa buscando casos.', 'El médico realiza el diagnóstico del paciente', 'Solicitar semanalmente reportes de centros centinela.', "Se remite el paciente a un centro especializado.", "Se remiten estadísticas a la secretaria de salud municipal.","Un hospital reporta semanalmente los pacientes atendidos por dengue."];
        const posicionesParaLasCajas = [
            {x: 85, y: 210}, {x: 85, y: 330}, {x: 85, y: 460},
            {x: 575, y: 195}, {x: 575, y: 230}, {x: 575, y: 265},
            {x: 575, y: 300}, {x: 575, y: 335}, {x: 575, y: 370},
            {x: 575, y: 400}, {x: 575, y: 435}, {x: 575, y: 472},
            {x: 575, y: 500}, {x: 575, y: 533}, {x: 575, y: 570},
            
        ];

        const medidasParaLasCajas = [
            {w: 250, h: 30}, // 1
            {w: 240, h: 30},  // 2
            {w: 250, h: 30}, // 3
            {w: 210, h: 30},  // 
            {w: 210, h: 30},  // 
            {w: 210, h: 30},  // 
            {w: 210, h: 30},  //
            {w: 210, h: 30}, //
            {w: 210, h: 30},  // 
            {w: 210, h: 30}, // 
            {w: 210, h: 40}, // 
            {w: 210, h: 35},  // 
            {w: 210, h: 35},  // 
            {w: 210, h: 35},  // 
            {w: 210, h: 35},  // 
            
];

    for (let i = 0; i < variables.length; i++) {
    const valor = variables[i];
    const pos = posicionesParaLasCajas[i];
    const medida = medidasParaLasCajas[i];

    const texto = new Sprite(new Bitmap(medida.w, medida.h));
    texto.bitmap.fontSize = 12;
    texto.bitmap.fontFace = 'Arial';
    texto.bitmap._context.font = `bold ${texto.bitmap.fontSize}px ${texto.bitmap.fontFace}`;
    texto.bitmap.outlineWidth = 0;
    texto.bitmap.outlineColor = 'rgba(0,0,0,0)';
    texto.bitmap.textColor = "#0b0b0bff";

    const ctx = texto.bitmap._context;
    const palabras = valor.split(' ');
    const lineas = [];
    let lineaActual = '';

    for (let palabra of palabras) {
        const testLinea = lineaActual.length > 0 ? lineaActual + ' ' + palabra : palabra;
        const anchoTest = ctx.measureText(testLinea).width;

        if (anchoTest <= medida.w) {
            lineaActual = testLinea;
        } else {
            lineas.push(lineaActual);
            lineaActual = palabra;
        }
    }

    if (lineaActual.length > 0) {
        lineas.push(lineaActual);
    }

    const lineHeight = texto.bitmap.fontSize + 2;

    for (let j = 0; j < lineas.length; j++) {
        texto.bitmap.drawText(lineas[j], 0, j * lineHeight, medida.w, lineHeight, 'left');
    }

    texto.x = pos.x;
    texto.y = pos.y;
    texto._posicionInicial = {x: pos.x, y: pos.y};
    texto._valor = valor;
    texto._arrastrando = false;

    this._elementos.push(texto);
    this.addChild(texto);
}

    };









Scene_Vigilancia.prototype.createDraggableNumbers = function() {
  this._draggableNumbers = [];

  const numberPositions = [
    {x: 545, y: 205}, {x: 545, y: 235}, {x: 545, y: 270},
    {x: 545, y: 300}, {x: 545, y: 330}, {x: 545, y: 364},
    {x: 545, y: 400}, {x: 545, y: 435}, {x: 545, y: 470},
    {x: 545, y: 505}, {x: 545, y: 540}, {x: 545, y: 575}
  ];
  const medidas = [
            {w: 30, h: 30}, //
            {w: 30, h: 30},  // 
            {w: 30, h: 30}, // 
            {w: 30, h: 30},  // 
            {w: 30, h: 30},  // 
            {w: 30, h: 30},  // 
            {w: 30, h: 30},  // 
            {w: 30, h: 30}, //
            {w: 30, h: 30},  //
            {w: 30, h: 30}, //
            {w: 30, h: 30}, // 
            {w: 30, h: 30},  // 
  ]



  for (let i = 0; i < numberPositions.length; i++) {
    const number = i + 1;
    const pos = numberPositions[i];
    const medida = medidas[i]; //Acceder al ancho y alto específico


    const sprite = new Sprite(new Bitmap(medida.w, medida.h));
    sprite.bitmap.textColor = "#0b0b0bff"; 
    sprite.bitmap.fontSize = 18;
    sprite.bitmap.fontFace = 'Arial';
    sprite.bitmap.outlineWidth = 0;
    sprite.bitmap.drawText(number, 0, 0, medida.w, medida.h, 'left');
    sprite.visible = true;
    

    sprite.x = pos.x;
    sprite.y = pos.y;
    sprite._startX = sprite.x;
    sprite._startY = sprite.y;
    sprite._number = number;
    sprite._dragging = false;
    sprite._pressed = false;
    sprite._valor = number;

    this._draggableNumbers.push(sprite);
    this.addChild(sprite);
  }

  this._currentDragged = null;
};

Scene_Vigilancia.prototype.createDropBoxes = function() {
  this._dropBoxes = [];

  
  const boxPositions = [
    {x: 320, y: 200 }, {x: 320, y: 244}, {x: 320, y: 316},
    {x: 320, y: 365}, {x: 320, y: 445}, {x: 320, y: 496},
  ];

  const medidas = [
            {w: 120, h: 30}, //
            {w: 120, h: 30},  // 
            {w: 120, h: 30}, // 
            {w: 120, h: 30},  // 
            {w: 120, h: 30},  // 
            {w: 120, h: 30},  // 
            ]

  const correctAnswers = [12, 3, 2, 7, 1, 9]; //Respuestas correctas por orden

  for (let i = 0; i < boxPositions.length; i++) {
    const pos = boxPositions[i];
    const medida = medidas[i]; //Acceder al ancho y alto específico
    const box = new Sprite(new Bitmap(medida.w, medida.h));
    box.bitmap.fontSize = 18; 
    box.bitmap.fillRect(0, 0, 70, 30, '#f2f7f7ff');
    box.bitmap.drawText(medida.w, medida.h);
    box.x = pos.x;
    box.y = pos.y;
    box._ocupada = false;
    box._occupied = false;
    box._correctNumber = correctAnswers[i]; // Respuesta correcta
    box._currentNumber = null;
    
    this._dropBoxes.push(box);
    this.addChild(box);
  }
  
};
Scene_Vigilancia.prototype.getBoxGroups = function() {
  return [
    [12, 3],   // cajas 0 y 1
    [2, 7],   // cajas 2 y 3
    [1, 9]   // cajas 4 y 5
  ];
};

//Funcion para los botones de salir 
Scene_Vigilancia.prototype.createBottomButtons = function() {
  const buttonWidth = 180;
  const buttonHeight = 40;

  
  const self = this;

  // BOTÓN: Finalizar prueba
  const btnFinalizar = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  btnFinalizar.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, '#b85155ff');
  btnFinalizar.bitmap.textColor = '#100f0fff';
  btnFinalizar.bitmap.fontFace = 'Arial';
  btnFinalizar.bitmap.outlineWidth = 0;
  btnFinalizar.bitmap.drawText("Cerrar sin finalizar", 0, 0, buttonWidth, buttonHeight, 'center');
  btnFinalizar.x = Graphics.width / 3 - buttonWidth - 20;
  btnFinalizar.y = Graphics.height - buttonHeight - 45;

  btnFinalizar.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    if (TouchInput.isTriggered()) {
      if (x >= this.x && x <= this.x + this.width &&
          y >= this.y && y <= this.y + this.height) {
        SceneManager.pop();
      }
    }
  };

  // BOTÓN: Cerrar sin finalizar
  const btnCerrar = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  btnCerrar.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, '#89f770ff'); 
  btnCerrar.bitmap.textColor = '#0e0d0dff';
  btnCerrar.bitmap.fontFace = 'Arial';
  btnCerrar.bitmap.outlineWidth = 0;
  btnCerrar.bitmap.drawText("Finalizar prueba", 0, 0, buttonWidth, buttonHeight, 'center');
  btnCerrar.x = Graphics.width / 3 + 20;
  btnCerrar.y = Graphics.height - buttonHeight - 45;

  btnCerrar.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    if (TouchInput.isTriggered()) {
      if (x >= this.x && x <= this.x + this.width &&
          y >= this.y && y <= this.y + this.height) {
          const isValid = self.validateAnswers(); 

        if (isValid) {
          _finalScore += _llevacuentas;
          const currentVida = $gameVariables.value(149);
          $gameVariables.setValue(4, currentVida + _llevacuentas);
          $gameSystem.definirPasadoJuego(true);
          //Refrescar visualmente
          SceneManager._scene._finalScoreBox.bitmap.clear();
          SceneManager._scene._finalScoreBox.bitmap.fillRect(0, 0, 300, 40, "#d5f5e3");
          SceneManager._scene._finalScoreBox.bitmap.textColor = "#000000";
          SceneManager._scene._finalScoreBox.bitmap.drawText("Calificacion: " + _finalScore, 0, 0, 300, 40, 'left');
          alert("✅ Prueba correcta. Se sumaron " + _llevacuentas + " puntos al resultado final.");
        } else {
          $gameVariables.setValue(149, $gameVariables.value(149) - 1);
          _llevacuentas = Math.max(0, _llevacuentas - 1);
          // Verificar si se acabaron los intentos
          if (_llevacuentas <= 0 || $gameVariables.value(149) <= 0) {
              //$gameSystem.setMiniGameLocked(true);
              //SceneManager.push(Scene_GameLocked);
              return;
            }
          alert("❌ Respuestas incorrectas. Se restó 1 punto. Puntaje actual: " + _llevacuentas);
          if (_llevacuentas === 5) {
            alert("⚠️ CUIDADO: solo te quedan 5 intentos, ve repasa tus notas y continua.")
            
          }
          
        }

        // Refrescar el texto del puntaje
        if (self._scoreBox) {

          self._scoreBox.bitmap.clear();
          self._scoreBox.bitmap.fillRect(0, 0, 250, 40, "#ffffcc");
          self._scoreBox.bitmap.textColor = "#000000";
          self._scoreBox.bitmap.drawText("Puntaje: " + _llevacuentas, 0, 0, 250, 40, 'left');
          
        }
        

        SceneManager.pop();

      }
    }
  };

  this.addChild(btnFinalizar);
  this.addChild(btnCerrar);
};

// Escena para mostrar cuando el juego está bloqueado
  function Scene_GameLocked() {
    this.initialize.apply(this, arguments);
  }

  Scene_GameLocked.prototype = Object.create(Scene_Base.prototype);
  Scene_GameLocked.prototype.constructor = Scene_GameLocked;

  Scene_GameLocked.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_GameLocked.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    // Mostrar imagen de fondo
    this._bg = new Sprite();
    const bgBitmap = ImageManager.loadBitmap('img/img_pluging/', 'TRiada_Respuestas', false);
    bgBitmap.addLoadListener(function() {
        this._bg.bitmap = bgBitmap;
        // Escalar la imagen al tamaño completo de la pantalla
        this._bg.scale.x = Graphics.width / bgBitmap.width;
        this._bg.scale.y = Graphics.height / bgBitmap.height;
    }.bind(this));
    this.addChild(this._bg);

    
    // Fondo oscuro semi-transparente
    this._bg = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    //this._bg.bitmap.fillRect(0, 0, Graphics.width, Graphics.height, 'rgba(254, 253, 253, 0.7)');
    this.addChild(this._bg);
    
    // Panel de mensaje
    const panelWidth = 500;
    const panelHeight = 250;
    this._panel = new Sprite(new Bitmap(panelWidth, panelHeight));
    //this._panel.bitmap.fillRect(0, 0, panelWidth, panelHeight, '#2c3e50');
    //this._panel.bitmap.drawText("¡Juego Bloqueado!", 0, 80, panelWidth, 40, 'center');
    this._panel.bitmap.fontSize = 24;
    //this._panel.bitmap.drawText("Has agotado todos tus intentos.", 0, 90, panelWidth, 40, 'center');
   // this._panel.bitmap.drawText("En esta imagen tienes las respuestas.", 0, 120, panelWidth, 40, 'center');
    this._panel.x = (Graphics.width - panelWidth) / 2;
    this._panel.y = (Graphics.height - panelHeight) / 2;
    this.addChild(this._panel);
    
    // Botón para cerrar
    const buttonWidth = 150;
    const buttonHeight = 40;
    this._closeButton = new Sprite(new Bitmap(buttonWidth, buttonHeight));
    this._closeButton.bitmap.fillRect(0, 0, buttonWidth, buttonHeight, '#e74c3c');
    this._closeButton.bitmap.drawText("Cerrar", 0, 0, buttonWidth, buttonHeight, 'center');
    this._closeButton.x = (Graphics.width - buttonWidth) / 2;
    this._closeButton.y = this._panel.y + panelHeight - buttonHeight + 175;
    
    this._closeButton.update = function() {
      Sprite.prototype.update.call(this);
      if (TouchInput.isTriggered() && 
          TouchInput.x >= this.x && TouchInput.x <= this.x + this.width &&
          TouchInput.y >= this.y && TouchInput.y <= this.y + this.height) {
        SceneManager.goto(Scene_Map);
      }
    };
    
    this.addChild(this._closeButton);
  };

  // Guardar estado de bloqueo
  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    const contents = _DataManager_makeSaveContents.call(this);
    contents._internalScore = _internalScore;
    contents._finalScore = _finalScore;
    contents._miniGameLocked = $gameSystem.isMiniGameLocked();
    return contents;
  };

  // Cargar estado de bloqueo
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    _internalScore = contents._internalScore || 0;
    _finalScore = contents._finalScore || 0;
    $gameSystem.setMiniGameLocked(contents._miniGameLocked || false);
  };


//logica de validacion 
Scene_Vigilancia.prototype.validateAnswers = function() {
  const groups = this.getBoxGroups();
  for (let g = 0; g < groups.length; g++) {
    const expectedNumbers = groups[g];
    const box1 = this._dropBoxes[g * 2];
    const box2 = this._dropBoxes[g * 2 + 1];

    const entered = [box1._currentNumber, box2._currentNumber];

    if (
      !expectedNumbers.includes(entered[0]) ||
      !expectedNumbers.includes(entered[1]) ||
      entered[0] === entered[1]
    ) {
      return false;
    }
  }
  return true;
};




// lugica arrastrar y soltar
//Lógica para soltar el número
Scene_Vigilancia.prototype.tryDrop = function(sprite) {
    let dropped = false;
    
    for (const box of this._dropBoxes) {
        const overlapX = sprite.x + sprite.width > box.x + 10 && sprite.x < box.x + box.width - 10;
        const overlapY = sprite.y + sprite.height > box.y + 10 && sprite.y < box.y + box.height - 10;
        const inBox = overlapX && overlapY;
        
        if (inBox) {
            // 1. Copiar el número a la caja (sin eliminar el original)
            box.bitmap.clear();
            box.bitmap.fillRect(0, 0, 70, 40, '#918f8fff');
            box.bitmap.drawText(sprite._number.toString(), 0, 0, 70, 40, 'center');
            box._occupied = true;
            box._currentNumber = sprite._number;
            dropped = true;
            
            // 2. Regresar el número arrastrado a su posición inicial
            sprite.x = sprite._startX;
            sprite.y = sprite._startY;
            sprite.visible = true; // Asegurar que sea visible
            
            this.checkAllBoxesFilled();
            break;
        }
    }

    if (!dropped) {
        // Si no se soltó en una caja, regresarlo igualmente
        sprite.x = sprite._startX;
        sprite.y = sprite._startY;
    }
};


})();









