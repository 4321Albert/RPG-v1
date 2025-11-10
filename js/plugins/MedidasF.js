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
    Object.defineProperty(window, '_puntajeActual', {
        get: function() {
            return $gameVariables.value(144);
        },
        set: function(valor) {
            $gameVariables.setValue(144, valor);
        }
    });

    //let _puntajeTotal = 0;
    //let _juegoTerminado = false;
    let _finalScore = 175; // puntaje final a comulado
    
    // Extensiones del sistema
    Game_System.prototype.juegoCompletado = function() {
        return this._juegoCompleto === true;
    };

    Game_System.prototype.establecerJuegoCompletado = function(estado) {
        this._juegoCompleto = estado;
    };

    Game_System.prototype.juegoBloqueado = function() {
        return this._juegoBloqueado === true;
    };

    Game_System.prototype.establecerBloqueo = function(estado2) {
        this._juegoBloqueado = estado2;
    };

    // Comando del plugin
    //const _comandoOriginal = Game_Interpreter.prototype.pluginCommand;
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(comando, args) {
        _Game_Interpreter_pluginCommand.call(this, comando, args);
        //_comandoOriginal.call(this, comando, args);
        
        if (comando === "IniciarPorcentajeGame") {
            if ($gameSystem.juegoBloqueado()) {
                SceneManager.push(Escena_JuegoBloqueado);
                return;
            }
            
            if ($gameSystem.juegoCompletado()) {
                alert("Ya completaste este desafío con la máxima puntuación.");
                return;
            }
            // variable contador 2
            if ($gameVariables.value(145) === 0) {
                $gameVariables.setValue(145, 10) 
            }
            
            if ($gameVariables.value(144) === 0) {
                $gameVariables.setValue(144, 10);
                
            }

            SceneManager.push(Escena_MinijuegoPorcentajes);
        }
    };

    // Escena principal del minijuego
    function Escena_MinijuegoPorcentajes() {
        this.initialize.apply(this, arguments);
    }

    Escena_MinijuegoPorcentajes.prototype = Object.create(Scene_Base.prototype);
    Escena_MinijuegoPorcentajes.prototype.constructor = Escena_MinijuegoPorcentajes;

    Escena_MinijuegoPorcentajes.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Escena_MinijuegoPorcentajes.prototype.create = function() {
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
        this.createInfoButton();
        //this.openConsultaWindow();
        

    };

    // Métodos de la escena
    Escena_MinijuegoPorcentajes.prototype.crearFondo = function() {
        this._fondo = new Sprite();
        const imagenFondo = ImageManager.loadBitmap('img/img_pluging/', 'M')
        
        imagenFondo.addLoadListener(() => {
            this._fondo.bitmap = imagenFondo;
            this._fondo.scale.x = Graphics.width / imagenFondo.width;
            this._fondo.scale.y = Graphics.height / imagenFondo.height;
        });
        
        this.addChild(this._fondo);
    };



 








  
  //metod del boton de enlaces
  Escena_MinijuegoPorcentajes.prototype.createConsultaButton = function() {
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
  Escena_MinijuegoPorcentajes.prototype.createInfoButton = function() {
  const buttonWidth = 150;
  const buttonHeight = 43;
  const buttonX = 50; 
  const buttonY = 45;

  // Crear el botón
  const infoButton = new Sprite(new Bitmap(buttonWidth, buttonHeight));
  infoButton._normalColor = '#dedadaff';
  infoButton._hoverColor = '#b1d5faff';
  infoButton._textColor = '#3a3939ff';
  infoButton._isHovered = false;

  const drawButton = (bgColor, textColor) => {
    infoButton.bitmap.clear();
    infoButton.bitmap.fillRect(0, 5, buttonWidth, buttonHeight, bgColor);
    infoButton.bitmap.fontSize =18;
    infoButton.bitmap.textColor = textColor;
    infoButton.bitmap.fontFace = 'Arial';
    infoButton.bitmap.outlineWidth = 0;
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
  Escena_MinijuegoPorcentajes.prototype.createFinalScoreBox = function() {
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
  Escena_MinijuegoPorcentajes.prototype.createScoreBox = function() {
  const scoreBox = new Sprite(new Bitmap(250, 40));
  scoreBox.x = 371;
  scoreBox.y = 50;

 
  scoreBox.bitmap.fillRect(0, 0, 200, 40, "#f2c298ff");
  scoreBox.bitmap.textColor = "#000000";
  scoreBox.bitmap.fontFace = 'Arial';
  scoreBox.bitmap.outlineWidth = 0;
  scoreBox.bitmap.fontSize = 18;
  scoreBox.bitmap.drawText("Puntaje actividad: " + _puntajeActual, 5, 5, 250, 40, 'left');


  this._scoreBox = scoreBox;
  this.addChild(scoreBox);
};
Escena_MinijuegoPorcentajes.prototype.openConsultaWindow = function() {
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
























      Escena_MinijuegoPorcentajes.prototype.updateDragAndDrop = function() {
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
  Escena_MinijuegoPorcentajes.prototype.resaltarCajasValidas = function(valor) {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              // Resaltar todas las cajas vacías (o puedes añadir lógica específica)
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, 'rgba(100, 255, 100, 0.3)');
              //caja.bitmap.drawText(caja._respuestaCorrecta, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  Escena_MinijuegoPorcentajes.prototype.resetearResaltadoCajas = function() {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, '#fefcfcff');
              //caja.bitmap.drawText(`Caja ${this._cajas.indexOf(caja)+1}`, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  // Actualizar en el método principal update
  Escena_MinijuegoPorcentajes.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
      this.updateDragAndDrop();
      
      if (Input.isTriggered('cancel')) {
          SoundManager.playCancel();
          SceneManager.pop();
      }
  };










    Escena_MinijuegoPorcentajes.prototype.crearElementosArrastrables = function() {
        this._elementos = [];
        
        const valores = ['4', '41%', '10', '24%', '13', '59%', '8', '76%', '0', '47%', '5', '29%', '17', '0%', '100%', "7"];
        const posiciones = [
            {x: 710, y: 120}, {x: 710, y: 155}, {x: 710, y: 185},
            {x: 710, y: 215}, {x: 710, y: 250}, {x: 710, y: 285},
            {x: 710, y: 315}, {x: 710, y: 345}, {x: 710, y: 375},
            {x: 710, y: 405}, {x: 710, y: 435}, {x: 710, y: 465},
            {x: 710, y: 495}, {x: 710, y: 525}, {x: 710, y: 555},
            {x: 710, y: 585}
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

    Escena_MinijuegoPorcentajes.prototype.crearCajasDestino = function() {
        this._cajas = [];
        
        const respuestasCorrectas = [
            '10', '7', '4', '8', '5', '17', '0', '13', '4', 
            '59%', '41%', '24%', '47%', '29%', '100%', '0%', '76%', '24%'
        ];
        
        const posicionesCajas = [
            // Columna izquierda
            {x: 380, y: 240}, {x: 380, y: 275}, {x: 380, y: 310},
            {x: 380, y: 342}, {x: 380, y: 380}, {x: 380, y: 413},
            {x: 380, y: 447}, {x: 380, y: 483}, {x: 380, y: 518},
            // Columna central
            {x: 500, y: 240}, {x: 500, y: 275}, {x: 500, y: 310},
            {x: 500, y: 342}, {x: 500, y: 380}, {x: 500, y: 413},
            {x: 500, y: 447}, {x: 500, y: 483}, {x: 500, y: 518}
        ];

        for (let i = 0; i < 18; i++) {
            const caja = new Sprite(new Bitmap(50, 30));
            caja.bitmap.fillRect(0, 0, 50, 5, '#f28e8eff');
            caja.bitmap.fontSize = 12; // Ajusta según necesidad
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

    Escena_MinijuegoPorcentajes.prototype.getBoxGroups = function() {
    return [
        '10',   // caja 1
        '7',    // caja 2
        '4',    // caja 3
        '8',    // caja 4
        '5',    // caja 5
        '17',   // caja 6
        '0',    // caja 7
        '13',   // caja 8
        '4',    // caja 9
        '59%',  // caja 10
        '41%',  // caja 11
        '24%',  // caja 12
        '47%',  // caja 13
        '29%',  // caja 14
        '100%', // caja 15
        '0%',   // caja 16
        '76%',  // caja 17
        '24%'   // caja 18
    ];
};


      Escena_MinijuegoPorcentajes.prototype.crearBotonesInferiores = function() {
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
      botonCancelar.y = Graphics.height - altoBoton - 30;

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
      botonValidar.y = Graphics.height - altoBoton - 30;

      
      botonValidar.update = function() {
        Sprite.prototype.update.call(this);
        const x = TouchInput.x;
        const y = TouchInput.y;
          if (TouchInput.isTriggered()) {
            if (x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height) {
                const isValid = self.checkAllAnswers(); 

                if (isValid) {
                _finalScore += _puntajeActual;
                const currentVida = $gameVariables.value(4);
                $gameVariables.setValue(4, currentVida + _puntajeActual);
                $gameSystem.establecerJuegoCompletado(true);
                //Refrescar visualmente
                SceneManager._scene._finalScoreBox.bitmap.clear();
                SceneManager._scene._finalScoreBox.bitmap.fillRect(0, 0, 300, 40, "#d5f5e3");
                SceneManager._scene._finalScoreBox.bitmap.textColor = "#000000";
                SceneManager._scene._finalScoreBox.bitmap.drawText("Calificacion: " + _finalScore, 0, 0, 300, 40, 'left');
                alert("✅ Prueba correcta. Se sumaron " + _puntajeActual + " puntos al resultado final.");
                } else {
                $gameVariables.setValue(145, $gameVariables.value(145) - 1);
                _puntajeActual = Math.max(0, _puntajeActual - 1);
                // Verificar si se acabaron los intentos
                if (_puntajeActual <= 0 || $gameVariables.value(145) <= 0) {
                   $gameSystem.establecerBloqueo(true);
                   SceneManager.push(Escena_JuegoBloqueado);
                   return;
                 }
                alert("❌ Respuestas incorrectas. Se restó 1 punto. Puntaje actual: " + _puntajeActual);
                if (_puntajeActual === 5) {
                    alert("⚠️ CUIDADO: solo te quedan 5 intentos, ve repasa tus notas y continua.")
                    
                }
                
                }

            // Refrescar el texto del puntaje
            //if (self._scoreBox) {

            //  self._scoreBox.bitmap.clear();
            //  self._scoreBox.bitmap.fillRect(0, 0, 250, 40, "#ffffcc");
            //  self._scoreBox.bitmap.textColor = "#000000";
            //  self._scoreBox.bitmap.drawText("Puntaje: " + _internalScore, 0, 0, 250, 40, 'left');
            
            //}
            

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

    Escena_MinijuegoPorcentajes.prototype.validarRespuestas = function() {
        for (let i = 0; i < this._cajas.length; i++) {
            const caja = this._cajas[i];
            if (!caja._ocupada || caja._valorActual !== caja._respuestaCorrecta) {
                return false;
            }
        }
        return true;
    };

    // Escena de juego bloqueado
    function Escena_JuegoBloqueado() {
        this.initialize.apply(this, arguments);
    }







      Escena_MinijuegoPorcentajes.prototype.tryDrop = function(elementoArrastrable) {
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
  Escena_MinijuegoPorcentajes.prototype.obtenerColorSegunTipo = function(valor) {
      // Colores diferentes para números vs porcentajes
      return valor.includes('%') ? '#f2f4f6ff' : '#fbf9f8ff';
  };

  Escena_MinijuegoPorcentajes.prototype.crearEfectoSoltado = function(x, y) {
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
    Escena_MinijuegoPorcentajes.prototype.checkAllBoxesFilled = function() {
    const allFilled = this._cajas.every(box => box._occupied);
    if (!allFilled) return false;

    const expectedValues = this.getBoxGroups(); // arreglo plano: ['10', '7', ..., '24%']
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



    Escena_MinijuegoPorcentajes.prototype.checkAllAnswers = function() {
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
















  function Escena_JuegoBloqueado() {
    this.initialize.apply(this, arguments);
  }

  Escena_JuegoBloqueado.prototype = Object.create(Scene_Base.prototype);
  Escena_JuegoBloqueado.prototype.constructor = Escena_JuegoBloqueado;

  Escena_JuegoBloqueado.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Escena_JuegoBloqueado.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    // Mostrar imagen de fondo
    this._bg = new Sprite();
    const bgBitmap = ImageManager.loadBitmap('img/img_pluging/', 'RetroAlimentacionMedidas', false);
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
    contents._puntajeActual = _puntajeActual;
    contents._finalScore = _finalScore;
    contents._juegoBloqueado = $gameSystem.juegoBloqueado();
    return contents;
  };

  // Cargar estado de bloqueo
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    _puntajeActual = contents._puntajeActual || 0;
    _finalScore = contents._finalScore || 0;
    $gameSystem.establecerBloqueo(contents._juegoBloqueado || false);
  };


    // [Implementación similar pero con nombres cambiados...]

})();