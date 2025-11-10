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
  Object.defineProperty(window, '_elquecuenta23', {
    get: function() {
      return $gameVariables.value(165);
    },
    set: function(value) {
      $gameVariables.setValue(165, value);
    }
  
});

  let _finalScore = 175; // puntaje final a comulado
  let _gamePassed = false;
  
   
  
           
const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;



    // Extiende Game_System para guardar si ya pasó la prueba
  Game_System.prototype.hasPassedMiniGameee23 = function() {
    return this._miniGamePasseddd23 === true;
  };

  Game_System.prototype.setPassedMiniGameee23 = function(passeddd) {
    this._miniGamePasseddd23 = passeddd;
  };

  // Verifica si el juego está bloqueado
  Game_System.prototype.isMiniGameLockeddd23 = function() {
    return this._miniGameLockeddd23 === true;
  };
  Game_System.prototype.setMiniGameLockeddd23 = function(lockeddd) {
    this._miniGameLockeddd23 = lockeddd;
  };


  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    //funcion para comando de pluging
    if (command === "ND") {
      // Verificar si el juego está bloqueado
      if ($gameSystem.isMiniGameLockeddd23()) {
        SceneManager.push(Scene_GameLockeddd23);
        return;
      }
      if ($gameSystem.hasPassedMiniGameee23()) {
        alert("⚠️ Ya no puedes volver a presentar la prueba. Ya sacaste el mayor puntaje.");
        return;
      }
      if ($gameVariables.value(166)===0) {
        $gameVariables.setValue(166, 10)
        
      }
  

      if ($gameVariables.value(165) === 0) {
        $gameVariables.setValue(165, 10);
      }

      SceneManager.push(scene_NivelesPre);
   }


  };
//funcion para comando de pluging
  function scene_NivelesPre() {
    this.initialize.apply(this, arguments);
  }

  
//funcion para comando de pluging
  scene_NivelesPre.prototype = Object.create(Scene_Base.prototype);
  scene_NivelesPre.prototype.constructor = scene_NivelesPre;
//funcion para comando de pluging
  scene_NivelesPre.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };
//funcion para ejecutar las funciones
  scene_NivelesPre.prototype.create = function() {
    Scene_Base.prototype.create.call(this);

    this.createImageWindow();          // 1. Crea la ventana con la imagen de fondo
    this.createConsultaButton();       // 2. Crea el botón de "Referencias"
    this.createBottomButtons();        // 3. Crea los botones inferiores ("Cerrar sin finalizar" y "Finalizar prueba")
    this.createScoreBox();             // 4. Crea la caja de puntaje de la actividad
    this.createFinalScoreBox();        // 5. Crea la caja de puntaje final (Tarea 2)
    this.crearElementosDeTexto();      // 6. Crea los elementos de texto (descripciones)
    this.createDraggableNumbers();     // 7. Crea los números arrastrables
    this.createDropBoxes();            // 8. Crea las cajas donde se soltarán los números
    this.createInfoButton();  
    

  };
  //funcion para comando de pluging
  scene_NivelesPre.prototype.update = function() {
  Scene_Base.prototype.update.call(this);
  this.updateDragAndDrop();

  if (Input.isTriggered('cancel')) {
    SceneManager.pop();
  }
};

scene_NivelesPre.prototype.updateDragAndDrop = function() {
  if (TouchInput.isTriggered()) {
    for (let sprite of this._draggableNumbers) {
      const x = TouchInput.x;
      const y = TouchInput.y;
      if (x >= sprite.x && x <= sprite.x + sprite.width &&
          y >= sprite.y && y <= sprite.y + sprite.height) {
        this._currentDragged = sprite;
        sprite._dragging = true;
        this.resaltarCajasValidas(true);
        break;
      }
    }
  }

  if (TouchInput.isPressed() && this._currentDragged) {
    const sprite = this._currentDragged;
    sprite.x = TouchInput.x - sprite.width / 2;
    sprite.y = TouchInput.y - sprite.height / 2;
  }

  if (TouchInput.isReleased() && this._currentDragged) {
    const sprite = this._currentDragged;
    sprite._dragging = false;
    this.tryDrop(sprite);
    this.resaltarCajasValidas(false);
    this._currentDragged = null;
  }
};




scene_NivelesPre.prototype.resaltarCajasValidas = function(activo) {
  const medidas = [
    {w: 50, h: 30},  // Caja 0
    {w: 50, h: 30},  // Caja 1
    {w: 50, h: 30},  // Caja 2
    {w: 50, h: 30},  // Caja 3
    {w: 50, h: 30},  // Caja 4
    {w: 50, h: 30},  // Caja 5
    {w: 50, h: 30},  // Caja 6
    {w: 50, h: 30}   // Caja 7
  ];

  for (let i = 0; i < this._dropBoxes.length; i++) {
    const caja = this._dropBoxes[i];
    const medida = medidas[i]; // ahora sí usamos el índice correctamente

    caja.bitmap.clear();

    if (activo) {
      // Usar el tamaño exacto de las medidas
      caja.bitmap.fillRect(0, 0, medida.w, medida.h, 'rgba(100, 255, 100, 0.3)');
    } else {
      caja.bitmap.fillRect(0, 0, medida.w, medida.h, 'rgba(242, 247, 247, 0.2)');
    }

    // Si la caja ya tiene un número, redibujarlo
    if (caja._currentNumber != null) {
      caja.bitmap.textColor = 'black';
      caja.bitmap.drawText(
        caja._currentNumber.toString(),
        0, 0,
        medida.w, medida.h,
        'center'
      );
    }
  }
};





  //VENTANA DE ENLACES 
  scene_NivelesPre.prototype.openConsultaWindow = function() {
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
  scene_NivelesPre.prototype.createInfoButton = function() {
  const buttonWidth = 150;
  const buttonHeight = 40;
  const buttonX = 50; 
  const buttonY = 60;

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
  scene_NivelesPre.prototype.createFinalScoreBox = function() {
  const finalScoreBox = new Sprite(new Bitmap(300, 40));
  finalScoreBox.x = 599;  // Cambiar la posición
  finalScoreBox.y = 60;

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
  scene_NivelesPre.prototype.createScoreBox = function() {
  const scoreBox = new Sprite(new Bitmap(250, 40));
  scoreBox.x = 371;
  scoreBox.y = 60;

 
  scoreBox.bitmap.fillRect(0, 0, 200, 40, "#f2c298ff");
  scoreBox.bitmap.textColor = "#000000";
  scoreBox.bitmap.fontFace = 'Arial';
  scoreBox.bitmap.outlineWidth = 0;
  scoreBox.bitmap.fontSize = 18;
  scoreBox.bitmap.drawText("Puntaje actividad: " + _elquecuenta23, 0, 0, 250, 40, 'left');


  this._scoreBox = scoreBox;
  this.addChild(scoreBox);
};

  //Metodo de validacion 
  scene_NivelesPre.prototype.checkAllBoxesFilled = function() {
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
  scene_NivelesPre.prototype.createConsultaButton = function() {
  const buttonX = 225;  
  const buttonY = 60;  
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
 scene_NivelesPre.prototype.createImageWindow = function() {
  const sprite = new Sprite();
  const bitmap = ImageManager.loadBitmap('img/img_pluging/', 'presalud');

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







 scene_NivelesPre.prototype.crearElementosDeTexto = function() {
  this._elementos = [];
        
const variables = ['Tamizajes casa a casa con apoyo de la enfermera.', 'Eliminación de criaderos del mosquito Aedes aegypti en las veredas El Ocaso y La Esperanza.​', 'Toma de muestras de sangre para confirmar casos', 'Monitoreo de la calidad de agua, mediante la recoleccion de muestras en los lugares de captacion', 'Acompañamiento medico personas que se encuentren enfermas.​', 'Referencia prioritaria a centros de atención especializada.', 'Campañas de sensibilización sobre el uso seguro de plaguicidas en la vereda La Paz', "Identificación de nuevos casos febriles o con síntomas neurológicos mediante vigilancia activa"];
        const posicionesParaLasCajas = [
            {x: 520, y: 192}, {x: 515, y: 235}, {x: 520, y: 279},
            {x: 520, y: 325}, {x: 515, y: 373}, {x: 520, y: 420},
            {x: 520, y: 470}, {x: 520, y: 517}
            
        ];

        const medidasParaLasCajas = [
            {w: 300, h: 50},  // 1
            {w: 300, h: 50},  // 2
            {w: 300, h: 50},  // 3
            {w: 300, h: 50},  // 4
            {w: 300, h: 50}, //  5
            {w: 300, h: 50},  // 6
            {w: 300, h: 50}, //  7
            {w: 300, h: 50}, //  8
            
            
            
            
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





scene_NivelesPre.prototype.createDraggableNumbers = function() {
  this._draggableNumbers = [];

  const numberPositions = [
    {x: 495, y: 192}, {x: 495, y: 235}, {x: 495, y: 279},
    {x: 495, y: 325}, {x: 495, y: 373}, {x: 495, y: 420},
    {x: 495, y: 470}, {x: 495, y: 517}
  ];
  const medidas = [
            {w: 30, h: 30}, //
            {w: 30, h: 30},  // 
            {w: 30, h: 30}, // 
            {w: 30, h: 30},  // 
            {w: 30, h: 30},  // 
            {w: 30, h: 30},  // 
            {w: 30, h: 30},  // 
            {w: 30, h: 30} //      
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



scene_NivelesPre.prototype.createDropBoxes = function() {
  this._dropBoxes = [];

  
  const boxPositions = [
    { x: 298, y: 194 }, //0
    { x: 298, y: 237 }, //1
    { x: 298, y: 282 }, //2

    { x: 57, y: 397 }, //3
    { x: 57, y: 442 }, //4

    { x: 383, y: 376 }, //5
    { x: 383, y: 420 }, //6
    { x: 383, y: 464 } //7
  ];

  const correctAnswers = [2, 4, 7, 5, 6, 1, 3, 8]; //Respuestas correctas por orden

  for (let i = 0; i < boxPositions.length; i++) {
    const pos = boxPositions[i];
    const box = new Sprite(new Bitmap(50, 50));
    box.bitmap.fontSize = 18;
    box.bitmap.fillRect(0, 0, 'rgba(14, 13, 13, 0.2)'); // 0.2 = 20% opacidad
    //box.bitmap.fillRect(0, 0, 80, 30, '#f0a7a2ff');
    box.bitmap.drawText("", 3, 0, 60, 40, 'center');
    box.x = pos.x;
    box.y = pos.y;
    box._occupied = false;
    box._correctNumber = correctAnswers[i]; // Respuesta correcta
    box._currentNumber = null;
    
    this._dropBoxes.push(box);
    this.addChild(box);
  }
  
};
scene_NivelesPre.prototype.getBoxGroups = function() {
  return [
    [2, 4, 7],   // cajas 0 y 1
    [5, 6],   // cajas 2 y 3
    [1, 3, 8]   // cajas 4 y 5
  ];
};

//Funcion para los botones de salir 
scene_NivelesPre.prototype.createBottomButtons = function() {
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
  btnFinalizar.y = Graphics.height - buttonHeight - 25;

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
  btnCerrar.y = Graphics.height - buttonHeight - 25;

  btnCerrar.update = function() {
    Sprite.prototype.update.call(this);
    const x = TouchInput.x;
    const y = TouchInput.y;

    if (TouchInput.isTriggered()) {
      if (x >= this.x && x <= this.x + this.width &&
          y >= this.y && y <= this.y + this.height) {
          const isValid = self.validateAnswers(); 

        if (isValid) {
          _finalScore += _elquecuenta23;
          const currentVida = $gameVariables.value(4);
          $gameVariables.setValue(4, currentVida + _elquecuenta23);
          $gameSystem.setPassedMiniGameee23(true);
          //Refrescar visualmente
          SceneManager._scene._finalScoreBox.bitmap.clear();
          SceneManager._scene._finalScoreBox.bitmap.fillRect(0, 0, 300, 40, "#d5f5e3");
          SceneManager._scene._finalScoreBox.bitmap.textColor = "#000000";
          SceneManager._scene._finalScoreBox.bitmap.drawText("Calificacion: " + _finalScore, 0, 0, 300, 40, 'left');
          alert("✅ Prueba correcta. Se sumaron " + _elquecuenta23 + " puntos al resultado final.");
        } else {
          $gameVariables.setValue(166, $gameVariables.value(166) - 1);
          _elquecuenta23 = Math.max(0, _elquecuenta23 - 1);
          // Verificar si se acabaron los intentos
          if (_elquecuenta23 <= 0 || $gameVariables.value(166) <= 0) {
              $gameSystem.setMiniGameLockeddd23(true);
              SceneManager.push(Scene_GameLockeddd23);
              return;
            }
          alert("❌ Respuestas incorrectas. Se restó 1 punto. Puntaje actual: " + _elquecuenta23);
          if (_elquecuenta23 === 5) {
            alert("⚠️ CUIDADO: solo te quedan 5 intentos, ve repasa tus notas y continua.")
            
          }
          
        }

        // Refrescar el texto del puntaje
        if (self._scoreBox) {

          self._scoreBox.bitmap.clear();
          self._scoreBox.bitmap.fillRect(0, 0, 250, 40, "#ffffcc");
          self._scoreBox.bitmap.textColor = "#000000";
          self._scoreBox.bitmap.drawText("Puntaje: " + _elquecuenta23, 0, 0, 250, 40, 'left');
          
        }
        

        SceneManager.pop();

      }
    }
  };

  this.addChild(btnFinalizar);
  this.addChild(btnCerrar);
};

// Escena para mostrar cuando el juego está bloqueado
  function Scene_GameLockeddd23() {
    this.initialize.apply(this, arguments);
  }

  Scene_GameLockeddd23.prototype = Object.create(Scene_Base.prototype);
  Scene_GameLockeddd23.prototype.constructor = Scene_GameLockeddd23;

  Scene_GameLockeddd23.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_GameLockeddd23.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    // Mostrar imagen de fondo
    this._bg = new Sprite();
    const bgBitmap = ImageManager.loadBitmap('img/img_pluging/', 'n', false);
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
    contents._elquecuenta23 = _elquecuenta23;
    contents._finalScore = _finalScore;
    contents._miniGameLockeddd23 = $gameSystem.isMiniGameLockeddd23();
    return contents;
  };

  // Cargar estado de bloqueo
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    _elquecuenta23 = contents._elquecuenta23 || 0;
    _finalScore = contents._finalScore || 0;
    $gameSystem.setMiniGameLockeddd23(contents._miniGameLockeddd23 || false);
  };


//logica de validacion 

 scene_NivelesPre.prototype.validateAnswers = function() {
  const groups = this.getBoxGroups();
  
  // Definir cuántas cajas tiene cada grupo
  const groupSizes = [3, 2, 3]; // Grupo 0: 3 cajas, Grupo 1: 2 cajas, Grupo 2: 3 cajas
  
  let currentBoxIndex = 0;
  
  for (let g = 0; g < groups.length; g++) {
    const expectedNumbers = groups[g];
    const groupSize = groupSizes[g];
    
    // Obtener las cajas de este grupo
    const groupBoxes = [];
    for (let i = 0; i < groupSize; i++) {
      groupBoxes.push(this._dropBoxes[currentBoxIndex + i]);
    }
    
    // Obtener los números ingresados en este grupo
    const enteredNumbers = [];
    for (const box of groupBoxes) {
      if (!box._currentNumber) {
        return false; // Caja vacía
      }
      enteredNumbers.push(box._currentNumber);
    }
    
    // Verificar que todos los números pertenezcan al grupo esperado
    for (const num of enteredNumbers) {
      if (!expectedNumbers.includes(num)) {
        return false;
      }
    }
    
    // Verificar que no haya números duplicados en el grupo
    const uniqueNumbers = new Set(enteredNumbers);
    if (uniqueNumbers.size !== enteredNumbers.length) {
      return false;
    }
    
    // Mover al siguiente grupo de cajas
    currentBoxIndex += groupSize;
  }
  
  return true;
};





// lugica arrastrar y soltar
//Lógica para soltar el número
scene_NivelesPre.prototype.tryDrop = function(sprite) {
    let dropped = false;
    
    for (const box of this._dropBoxes) {
        const overlapX = sprite.x + sprite.width > box.x + 10 && sprite.x < box.x + box.width - 10;
        const overlapY = sprite.y + sprite.height > box.y + 10 && sprite.y < box.y + box.height - 10;
        const inBox = overlapX && overlapY;
        
        if (inBox) {
            // 1. Copiar el número a la caja (sin eliminar el original)
            box.bitmap.clear();
            box.bitmap.fillRect(0, 0, 50, 50, '#918f8fff');
            //box.bitmap.drawText(sprite._number.toString(), 0, 0, box.width, box.height, 'center');
            box.bitmap.drawText(sprite._number.toString(), 10, 10, 50, 50, 'left');
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









