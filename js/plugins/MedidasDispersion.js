/*:
 * @plugindesc [v2.0] Minijuego de Asociación de Porcentajes - 18 cajas
 * @author Luis
 *
 * @help
 * Comando de evento para activar el minijuego:
 *     IniciarPorcentajeGame
 */

(function() {


    // Propiedades globales
    Object.defineProperty(window, '_cuentacuenta12', {
        get: function() {
            return $gameVariables.value(158);
        },
        set: function(valor) {
            $gameVariables.setValue(158, valor);
        }
    });

    //let _puntajeTotal = 0;
    //let _juegoTerminado = false;
    let _finalScore = 175; // puntaje final a comulado
    
    // Extensiones del sistema
    Game_System.prototype.juegoCompletadoo12 = function() {
        return this._juegoCompletoo12=== true;
    };

    Game_System.prototype.establecerjuegoCompletadoo12 = function(estado) {
        this._juegoCompletoo12= estado;
    };

    Game_System.prototype.juegoBloqueadoo12= function() {
        return this._juegoBloqueadoo12=== true;
    };

    Game_System.prototype.establecerBloqueoo12= function(estado2) {
        this._juegoBloqueadoo12= estado2;
    };

    // Comando del plugin
    //const _comandoOriginal = Game_Interpreter.prototype.pluginCommand;
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(comando, args) {
        _Game_Interpreter_pluginCommand.call(this, comando, args);
        //_comandoOriginal.call(this, comando, args);
        
        if (comando === "MDispersion") {
            if ($gameSystem.juegoBloqueadoo12()) {
                SceneManager.push(Escena_Bloqueooo12);
                return;
            }
            
            if ($gameSystem.juegoCompletadoo12()) {
                alert("Ya completaste este desafío con la máxima puntuación.");
                return;
            }
            // variable contador 2
            if ($gameVariables.value(159) === 0) {
                $gameVariables.setValue(159, 10) 
            }
            //contador 1
            if ($gameVariables.value(158) === 0) {
                $gameVariables.setValue(158, 10);
                
            }

            SceneManager.push(Scene_MD);
        }
    };

    // Escena principal del minijuego
    function Scene_MD() {
        this.initialize.apply(this, arguments);
    }

    Scene_MD.prototype = Object.create(Scene_Base.prototype);
    Scene_MD.prototype.constructor = Scene_MD;

    Scene_MD.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_MD.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        
        
        this.crearFondo();
        this.crearElementosArrastrables();
        this.crearCajasDestino();
        //this.crearBotonAyuda();
        this.crearBotonesInferiores();
        //this.crearPanelPuntaje();
        //this.crearPanelPuntajeTotal();
        this.createScoreBox();
        this.createFinalScoreBox();
        this.createConsultaButton();
        //this.openConsultaWindow();
        this.crearElementosDeTexto();
        this.createInfoButton();
        

    };

    // Métodos de la escena
    Scene_MD.prototype.crearFondo = function() {
        this._fondo = new Sprite();
        const imagenFondo = ImageManager.loadBitmap('img/img_pluging/', 'MD')
        
        imagenFondo.addLoadListener(() => {
            this._fondo.bitmap = imagenFondo;
            this._fondo.scale.x = Graphics.width / imagenFondo.width;
            this._fondo.scale.y = Graphics.height / imagenFondo.height;
        });
        
        this.addChild(this._fondo);
    };



 








  
  //metod del boton de enlaces
  Scene_MD.prototype.createConsultaButton = function() {
  const buttonX = 225;  
  const buttonY = 50;  
  const buttonWidth = 115;
  const buttonHeight = 40;

  const button = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  button._normalColor = '#dcdcdfff';    
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

  
  //METODOS DEL PLUGING

 

  //funcion mostrar mas informacion 
  //funcion mostrar mas informacion 
Scene_MD.prototype.createInfoButton = function() {
  const buttonWidth = 150;
  const buttonHeight = 43;
  const buttonX = 50; 
  const buttonY = 45;

  // Crear el botón
  const infoButton = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  infoButton._normalColor = '#dedadaff';
  infoButton._hoverColor = '#b1d5faff';
  infoButton._clickedColor = '#8fb8e6ff'; // Color opcional para cuando está clickeado
  infoButton._textColor = '#3a3939ff';
  infoButton._isHovered = false;
  infoButton._isClicked = false; // Nuevo estado para controlar el clic

  const drawButton = (bgColor, textColor) => {
    infoButton.bitmap.clear();
    infoButton.bitmap.fillRect(0, 5, buttonWidth, buttonHeight, bgColor);
    infoButton.bitmap.fontSize = 18;
    infoButton.bitmap.textColor = textColor;
    infoButton.bitmap.fontFace = 'Arial';
    infoButton.bitmap.outlineWidth = 0;
    infoButton.bitmap.drawText("Mas Información", 5, 5, buttonWidth, buttonHeight, 'left');
  };

  // Dibujar el botón en estado normal inicialmente
  drawButton(infoButton._normalColor, infoButton._textColor);

  infoButton.x = buttonX;
  infoButton.y = buttonY;

  // Crear el cuadro de texto emergente
  const tooltip = new Sprite(new Bitmap(450, 200));
  const bmp = tooltip.bitmap;
  bmp.outlineColor = 'rgba(0, 0, 0, 0)';
  bmp.outlineWidth = 0;

  tooltip.bitmap.textColor = "#000000";
  tooltip.bitmap.fillRect(0, 0, 390, 130, "#ffffe0");
  tooltip.bitmap.fontSize = 15;

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

    // Manejar hover
    if (hovered !== this._isHovered && !this._isClicked) {
      this._isHovered = hovered;
      drawButton(hovered ? this._hoverColor : this._normalColor, this._textColor);
    }

    // Manejar clic
    if (hovered && TouchInput.isTriggered()) {
      this._isClicked = !this._isClicked; // Alternar estado de clic
      
      if (this._isClicked) {
        drawButton(this._clickedColor || this._hoverColor, this._textColor);
        tooltip.visible = true;
      } else {
        drawButton(this._normalColor, this._textColor);
        tooltip.visible = false;
      }
    }

    // Ocultar tooltip si se hace clic fuera del botón
    if (this._isClicked && TouchInput.isTriggered() && !hovered) {
      this._isClicked = false;
      drawButton(this._normalColor, this._textColor);
      tooltip.visible = false;
    }
  };

  this.addChild(infoButton);
  this.addChild(tooltip);
};

  //funcion mostrar puntaje de la tarea 2
  Scene_MD.prototype.createFinalScoreBox = function() {
  const finalScoreBox = new Sprite(new Bitmap(300, 40));
  finalScoreBox.x = 599;  // Cambiar la posición
  finalScoreBox.y = 50;

  finalScoreBox.bitmap.fillRect(0, 0, 190, 40, "#f5d1b4ff"); 
  finalScoreBox.bitmap.textColor = "#000000";
  finalScoreBox.bitmap.fontFace = 'Arial';
  finalScoreBox.bitmap.outlineWidth = 0;
  const vida = $gameVariables.value(4);
  finalScoreBox.bitmap.fontSize =18;
  finalScoreBox.bitmap.drawText("Puntaje Tarea 2: " + vida, 5, 5, 250, 40, 'left');

  this._finalScoreBox = finalScoreBox;
  this.addChild(finalScoreBox);
};

    //Mostrar el puntaje en pantalla
  Scene_MD.prototype.createScoreBox = function() {
  const scoreBox = new Sprite(new Bitmap(250, 40));
  scoreBox.x = 371;
  scoreBox.y = 50;

 
  scoreBox.bitmap.fillRect(0, 0, 200, 40, "#f2c298ff");
  scoreBox.bitmap.textColor = "#000000";
  scoreBox.bitmap.fontFace = 'Arial';
  scoreBox.bitmap.outlineWidth = 0;
  scoreBox.bitmap.fontSize = 18;
  scoreBox.bitmap.drawText("Puntaje actividad: " + _cuentacuenta12, 5, 5, 250, 40, 'left');


  this._scoreBox = scoreBox;
  this.addChild(scoreBox);
};
Scene_MD.prototype.openConsultaWindow = function() {
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
    // agregar más enlaces aquí
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
























      Scene_MD.prototype.updateDragAndDrop = function() {
      // Fase 1: Iniciar arrastre
      if (TouchInput.isTriggered()) {
          for (const elemento of this._elementos) {
              const x = TouchInput.x;
              const y = TouchInput.y;
              
              if (x >= elemento.x && x <= elemento.x + elemento.width &&
                  y >= elemento.y && y <= elemento.y + elemento.height) {
                  this._elementoArrastrado = elemento;
                  elemento._arrastrando = true;
                  
                  // Efecto visual al seleccionar
                  elemento.scale.x = 1.1;
                  elemento.scale.y = 1.1;
                  SoundManager.playCursor();
                  break;
              }
          }
      }

      // Fase 2: Mover elemento arrastrado
      if (TouchInput.isPressed() && this._elementoArrastrado) {
          const elemento = this._elementoArrastrado;
          elemento.x = TouchInput.x - elemento.width / 2;
          elemento.y = TouchInput.y - elemento.height / 2;
          
          // Resaltar cajas válidas durante el arrastre
          this.resaltarCajasValidas(elemento._valor);
      } else {
          this.resetearResaltadoCajas();
      }

      // Fase 3: Soltar elemento
      if (TouchInput.isReleased() && this._elementoArrastrado) {
          const elemento = this._elementoArrastrado;
          elemento._arrastrando = false;
          elemento.scale.x = 1.0;
          elemento.scale.y = 1.0;
          
          // Intenta soltar en una caja válida
          this.tryDrop(elemento);
          
          this.resetearResaltadoCajas();
          this._elementoArrastrado = null;
      }
  };

  // Métodos auxiliares para el drag and drop
  Scene_MD.prototype.resaltarCajasValidas = function(valor) {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              // Resaltar todas las cajas vacías (o puedes añadir lógica específica)
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, 'rgba(100, 255, 100, 0.3)');
              //caja.bitmap.drawText(caja._respuestaCorrecta, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  Scene_MD.prototype.resetearResaltadoCajas = function() {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, '#fefcfcff');
              //caja.bitmap.drawText(`Caja ${this._cajas.indexOf(caja)+1}`, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  // Actualizar en el método principal update
  Scene_MD.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
      this.updateDragAndDrop();
      
      if (Input.isTriggered('cancel')) {
          SoundManager.playCancel();
          SceneManager.pop();
      }
  };

  Scene_MD.prototype.crearElementosDeTexto = function() {
  this._elements = [];
        
const variables = ['Edad(años)', 'Temperatura(Grados Centigrados)', 'Personas en el hogar', "25,7", "38,4", "3,11", "16,1", "1,3", "0,6",'El 95,5% de los habitantes tiene un rango de edad de 9,6  y 41,8 años​', 'El 95,5% de los habitantes tiene un rango de personas en el hogar de 1,9 y 4,3', 'El 68,3% de los habitantes tiene un rango de temperatura de 36 y 39,3 grados centígrados​', 'El 99,7% de los habitantes tiene un rango de personas en el hogar de 1,9 y 4,3',"El 95,5% de los habitantes tiene un rango de temperatura de 35,8 y 41 grados centígrados​","El 68,3% de los habitantes tiene un rango de edad de 9,6  y 41,8 años"];
        const posicionesParaLasCajas = [

            //{x: 145, y: 210}, {x: 340, y: 210}, {x: 425, y: 210},
            {x: 82, y: 240}, {x: 82, y: 280}, {x: 82, y: 350},  

            //medidas numeros decimales

            //columna 1
            {x: 200, y: 245 }, {x: 200, y: 315}, {x: 200, y: 390},
            
            // Columna 2
            {x: 285, y: 245}, {x: 285, y: 315}, {x: 285, y: 390},

            //elementos de la derecha
            {x: 550, y: 200}, //
            {x: 550, y: 250},//
            {x: 550, y: 310},//
            {x: 550, y: 395}, //
            {x: 550, y: 450}, 
            {x: 550, y: 520},
            //{x: 708, y: 370},
            //{x: 708, y: 400}, 
            
        ];

        const medidasParaLasCajas = [
            {w: 100, h: 40}, // 1
            {w: 100, h: 40},  // 2
            {w: 100, h: 40}, // 3
            {w: 100, h: 40},  // 4
            {w: 100, h: 40},  // 5
            {w: 150, h: 50},  // 6
            {w: 100, h: 40}, // 7
            {w: 100, h: 40}, // 8
            {w: 100, h: 40},  // 9

            {w: 200, h: 500}, // 10
            {w: 200, h: 500},  // 11
            {w: 200, h: 500},  // 12
            {w: 250, h: 500},  // 13
            {w: 200, h: 500}, //14
            {w: 200, h: 500}, // 15



            //{w: 200, h: 500},  // 16
            //{w: 200, h: 500}, // 17
            //{w: 200, h: 500},  // 18
            //{w: 210, h: 500},  // 19
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

    this._elements.push(texto);
    this.addChild(texto);
}

    };











    Scene_MD.prototype.crearElementosArrastrables = function() {
        this._elementos = [];
        
        const valores = ['1', '2', '3', '4', "5", "6"];
        const posiciones = [
            {x: 486, y: 208}, {x: 486, y: 258}, {x: 486, y: 318},
            {x: 486, y: 395}, {x: 486, y: 455}, {x: 486, y: 518},
        ];

        for (let i = 0; i < valores.length; i++) {
            const valor = valores[i];
            const pos = posiciones[i];
            const elemento = new Sprite(new Bitmap(70, 20));
            
            elemento.bitmap.fontSize = valor.includes('%') ? 18 : 22;
            elemento.bitmap.textColor = "#0b0b0bff";
            elemento.bitmap.fontFace = 'Arial';
            elemento.bitmap.outlineWidth = 0;
            //elemento.outlineWidth = 0;
            elemento.bitmap.drawText(valor, 0, 0, 60, 20, 'center');
            
            elemento.x = pos.x;
            elemento.y = pos.y;
            elemento._posicionInicial = {x: pos.x, y: pos.y};
            elemento._valor = valor;
            elemento._arrastrando = false;
            
            this._elementos.push(elemento);
            this.addChild(elemento);
        }
    };

    Scene_MD.prototype.crearCajasDestino = function() {
        this._cajas = [];
        
        const respuestasCorrectas = [
            '6', '5', '2'
        ];
        
        const posicionesCajas = [ 
            //Columna 1
            {x: 370, y: 240}, {x: 370, y: 300}, {x: 370, y: 365}
        ];

        for (let i = 0; i < 3; i++) {
            const caja = new Sprite(new Bitmap(52, 40));
            caja.bitmap.fillRect(0, 0, 50, 5, '#f28e8eff');
            caja.bitmap.fontSize = 12; // Ajustar el tamaño de la letra
            caja.bitmap.fillRect(0, 0, 'rgba(14, 13, 13, 0.2)'); // 0.2 = 20% opacidad
            caja.bitmap.drawText(`Suelta ${i+1}`, 0, 0, 70, 5, 'center');
            
            caja.x = posicionesCajas[i].x;
            caja.y = posicionesCajas[i].y;
            caja._respuestaCorrecta = respuestasCorrectas[i];
            caja._valorActual = null;
            caja._ocupada = false;
            this._cajas.push(caja);
            this.addChild(caja);
        }
    };

    Scene_MD.prototype.getBoxGroups = function() {
    return [
        '6',   // caja 1
        '5',    // caja 2
        '2',    // caja 3
        
    ];
};


      Scene_MD.prototype.crearBotonesInferiores = function() {
      const anchoBoton = 180;
      const altoBoton = 40;
      const self = this;

      // Botón "Cancelar"
      const botonCancelar = new Sprite(new Bitmap(anchoBoton, altoBoton));
      botonCancelar.bitmap.fillRect(0, 0, anchoBoton, altoBoton, '#e74c3c');
      botonCancelar.bitmap.textColor = '#070707ff';
      botonCancelar.bitmap.fontFace = 'Arial';
      botonCancelar.bitmap.outlineWidth = 0;
      botonCancelar.bitmap.drawText("Cancelar", 0, 0, anchoBoton, altoBoton, 'center');
      botonCancelar.x = Graphics.width / 2 - anchoBoton - 20;
      botonCancelar.y = Graphics.height - altoBoton - 15;

      botonCancelar.update = function() {
          Sprite.prototype.update.call(this);
          if (TouchInput.isTriggered() && this.esClicEnBoton()) {
              SoundManager.playCancel();
              SceneManager.pop();
          }
      };

      // Botón "Validar"
      const botonValidar = new Sprite(new Bitmap(anchoBoton, altoBoton));
      botonValidar.bitmap.fillRect(0, 0, anchoBoton, altoBoton, '#2ecc71');
      botonValidar.bitmap.textColor = '#080707ff';
      botonValidar.bitmap.fontFace = 'Arial';
      botonValidar.bitmap.outlineWidth = 0;
      botonValidar.bitmap.drawText("Validar Respuestas", 0, 0, anchoBoton, altoBoton, 'center');
      botonValidar.x = Graphics.width / 2 + 20;
      botonValidar.y = Graphics.height - altoBoton - 15;

      
      botonValidar.update = function() {
        Sprite.prototype.update.call(this);
        const x = TouchInput.x;
        const y = TouchInput.y;
          if (TouchInput.isTriggered()) {
            if (x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height) {
                const isValid = self.checkAllAnswers(); 

                if (isValid) {
                _finalScore += _cuentacuenta12;
                const currentVida = $gameVariables.value(4);
                $gameVariables.setValue(4, currentVida + _cuentacuenta12);
                $gameSystem.establecerjuegoCompletadoo12(true);
                //Refrescar visualmente
                SceneManager._scene._finalScoreBox.bitmap.clear();
                SceneManager._scene._finalScoreBox.bitmap.fillRect(0, 0, 300, 40, "#d5f5e3");
                SceneManager._scene._finalScoreBox.bitmap.textColor = "#000000";
                SceneManager._scene._finalScoreBox.bitmap.drawText("Calificacion: " + _finalScore, 0, 0, 300, 40, 'left');
                alert("✅ Prueba correcta. Se sumaron " + _cuentacuenta12 + " puntos al resultado final.");
                } else {
                $gameVariables.setValue(159, $gameVariables.value(159) - 1);
                _cuentacuenta12 = Math.max(0, _cuentacuenta12 - 1);
                // Verificar si se acabaron los intentos
                if (_cuentacuenta12 <= 0 || $gameVariables.value(159) <= 0) {
                    $gameSystem.establecerBloqueoo12(true);
                    SceneManager.push(Escena_Bloqueooo12);
                    return;
                    }
                alert("❌ Respuestas incorrectas. Se restó 1 punto. Puntaje actual: " + _cuentacuenta12);
                if (_cuentacuenta12 === 5) {
                    alert("⚠️ CUIDADO: solo te quedan 5 intentos, ve repasa tus notas y continua.")
                    
                }
                
                }

            // Refrescar el texto del puntaje
            if (self._scoreBox) {

              self._scoreBox.bitmap.clear();
              self._scoreBox.bitmap.fillRect(0, 0, 250, 40, "#ffffcc");
              self._scoreBox.bitmap.textColor = "#000000";
              self._scoreBox.bitmap.drawText("Puntaje: " + _cuentacuenta12, 0, 0, 250, 40, 'left');
            
            }
            

            SceneManager.pop();

        }
        }
      };

      // Añadir método auxiliar para detección de clics
      Sprite.prototype.esClicEnBoton = function() {
          const x = TouchInput.x;
          const y = TouchInput.y;
          return x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height;
      };

      this.addChild(botonCancelar);
      this.addChild(botonValidar);
  };


    // [Resto de métodos permanecen similares pero con nombres cambiados...]
    // Métodos como validarRespuestas, manejarArrastre, etc.

    Scene_MD.prototype.validarRespuestas = function() {
        for (let i = 0; i < this._cajas.length; i++) {
            const caja = this._cajas[i];
            if (!caja._ocupada || caja._valorActual !== caja._respuestaCorrecta) {
                return false;
            }
        }
        return true;
    };

    // Escena de juego bloqueado
    function Escena_Bloqueooo12() {
        this.initialize.apply(this, arguments);
    }







      Scene_MD.prototype.tryDrop = function(elementoArrastrable) {
      let soltadoEnCaja = false;
      const margenError = 15; // Pixeles de tolerancia para el área de soltar

      // Verificar colisión con cada caja
      for (const caja of this._cajas) {
          const dentroDeCaja = (
              elementoArrastrable.x + margenError >= caja.x &&
              elementoArrastrable.x + elementoArrastrable.width - margenError <= caja.x + caja.width &&
              elementoArrastrable.y + margenError >= caja.y &&
              elementoArrastrable.y + elementoArrastrable.height - margenError <= caja.y + caja.height
          );

          if (dentroDeCaja) {
              // Asignar el valor a la caja
              caja._valorActual = elementoArrastrable._valor;
              caja._ocupada = true;
              this.checkAllAnswers();
              
              // Actualizar gráfico de la caja
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, this.obtenerColorSegunTipo(elementoArrastrable._valor));
              caja.bitmap.fontSize = elementoArrastrable._valor.includes('%') ? 18 : 22;
              caja.bitmap.textColor = '#0b0b0bff';
              caja.bitmap.drawText(elementoArrastrable._valor, 0, 0, caja.width, caja.height, 'center');
              
              // Efecto visual
              this.crearEfectoSoltado(caja.x, caja.y);
              SoundManager.playEquip();
              
              soltadoEnCaja = true;
              break;
          }
      }

      // Resetear posición si no se soltó en caja válida
      if (!soltadoEnCaja) {
          elementoArrastrable.x = elementoArrastrable._posicionInicial.x;
          elementoArrastrable.y = elementoArrastrable._posicionInicial.y;
          SoundManager.playBuzzer();
      } else {
          // Devolver elemento a su posición original
          elementoArrastrable.x = elementoArrastrable._posicionInicial.x;
          elementoArrastrable.y = elementoArrastrable._posicionInicial.y;
      }
  };

  // Métodos auxiliares para tryDrop
  Scene_MD.prototype.obtenerColorSegunTipo = function(valor) {
      // Colores diferentes para números vs porcentajes
      return valor.includes('%') ? '#f2f4f6ff' : '#fbf9f8ff';
  };

  Scene_MD.prototype.crearEfectoSoltado = function(x, y) {
      const efecto = new Sprite(new Bitmap(80, 50));
      efecto.bitmap.fillRect(0, 0, 80, 50, 'rgba(255, 255, 255, 0.5)');
      efecto.x = x;
      efecto.y = y;
      efecto.opacity = 0;
      
      this.addChild(efecto);
      
      // Animación de fade
      //efecto.fadeIn(30, () => {
          //efecto.fadeOut(30, () => {
              //this.removeChild(efecto);
          //});
      //});
  };

  //Metodo de validacion 
    Scene_MD.prototype.checkAllBoxesFilled = function() {
    const allFilled = this._cajas.every(box => box._occupied);
    if (!allFilled) return false;

    const expectedValues = this.getBoxGroups(); // Arreglo ['10', '7', ..., '24%']
    let valid = true;

    for (let i = 0; i < this._cajas.length; i++) {
        const box = this._cajas[i];
        const expected = expectedValues[i];
        const actual = box._valorActual;

        if (actual !== expected) {
            console.log(`❌ Caja ${i + 1}: incorrecta - ingresado: "${actual}", esperado: "${expected}"`);
            valid = false;
        } else {
            console.log(`✅ Caja ${i + 1}: correcta - valor: "${actual}"`);
        }
    }

    return valid;
};



    Scene_MD.prototype.checkAllAnswers = function() {
    const allFilled = this._cajas.every(box => box._ocupada);
    if (!allFilled) return false;

    const expectedValues = this.getBoxGroups();

    for (let i = 0; i < this._cajas.length; i++) {
        const box = this._cajas[i];
        const expected = expectedValues[i];
        const actual = box._valorActual;

        if (actual !== expected) {
            console.log(`❌ Caja ${i + 1}: incorrecta - ingresado: "${actual}", esperado: "${expected}"`);
            return false;
        } else {
            console.log(`✅ Caja ${i + 1}: correcta - valor: "${actual}"`);
        }
    }

    return true;
};
















  function Escena_Bloqueooo12() {
    this.initialize.apply(this, arguments);
  }

  Escena_Bloqueooo12.prototype = Object.create(Scene_Base.prototype);
  Escena_Bloqueooo12.prototype.constructor = Escena_Bloqueooo12;

  Escena_Bloqueooo12.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Escena_Bloqueooo12.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    // Mostrar imagen de fondo
    this._bg = new Sprite();
    const bgBitmap = ImageManager.loadBitmap('img/img_pluging/', 'dispersionre', false);
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
    contents._cuentacuenta12 = _cuentacuenta12;
    contents._finalScore = _finalScore;
    contents._juegoBloqueadoo12= $gameSystem.juegoBloqueadoo12();
    return contents;
  };

  // Cargar estado de bloqueo
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    _cuentacuenta12 = contents._cuentacuenta12 || 0;
    _finalScore = contents._finalScore || 0;
    $gameSystem.establecerBloqueoo12(contents._juegoBloqueadoo12|| false);
  };


   
})();