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
    Object.defineProperty(window, '_contador', {
        get: function() {
            return $gameVariables.value(146);
        },
        set: function(valor) {
            $gameVariables.setValue(146, valor);
        }
    });

    //let _puntajeTotal = 0;
    //let _juegoTerminado = false;
    let _finalScore = 175; // puntaje final a comulado
    
    // Extensiones del sistema
    Game_System.prototype.juegoCompletado2 = function() {
        return this._juegoCompleto === true;
    };

    Game_System.prototype.establecerJuegoCompletado2 = function(estado) {
        this._juegoCompleto = estado;
    };

    Game_System.prototype.juegoBloqueado2 = function() {
        return this._juegoBloqueado === true;
    };

    Game_System.prototype.establecerBloqueo2 = function(estado2) {
        this._juegoBloqueado = estado2;
    };

    // Comando del plugin
    //const _comandoOriginal = Game_Interpreter.prototype.pluginCommand;
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(comando, args) {
        _Game_Interpreter_pluginCommand.call(this, comando, args);
        //_comandoOriginal.call(this, comando, args);
        
        if (comando === "IniciarClasiFVariables") {
            if ($gameSystem.lrmzJuegoBloqueado()) {
                SceneManager.push(Scene_LRMZ_BloqueoFinal);
                return;
            }
            
            if ($gameSystem.juegoCompletado2()) {
                alert("Ya completaste este desafío con la máxima puntuación.");
                return;
            }
            // variable contador 2
            if ($gameVariables.value(147) === 0) {
                $gameVariables.setValue(147, 10) 
            }
            
            if ($gameVariables.value(146) === 0) {
                $gameVariables.setValue(146, 10);
                
            }

            SceneManager.push(Escena_MinijuegoVariables);
        }
    };

    // Escena principal del minijuego
    function Escena_MinijuegoVariables() {
        this.initialize.apply(this, arguments);
    }

    Escena_MinijuegoVariables.prototype = Object.create(Scene_Base.prototype);
    Escena_MinijuegoVariables.prototype.constructor = Escena_MinijuegoVariables;

    Escena_MinijuegoVariables.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Escena_MinijuegoVariables.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        
        this.crearFondo();
        this.crearElementosDeTexto();
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
    Escena_MinijuegoVariables.prototype.crearFondo = function() {
        this._fondo = new Sprite();
        const imagenFondo = ImageManager.loadBitmap('img/img_pluging/', 'Variables')
        
        imagenFondo.addLoadListener(() => {
            this._fondo.bitmap = imagenFondo;
            this._fondo.scale.x = Graphics.width / imagenFondo.width;
            this._fondo.scale.y = Graphics.height / imagenFondo.height;
        });
        
        this.addChild(this._fondo);
    };



 








  
  
  
  //METODOS DEL PLUGING

 

  //funcion mostrar mas informacion 
  Escena_MinijuegoVariables.prototype.createInfoButton = function() {
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
  tooltip.x = infoButton.x + buttonWidth + 20;
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

//metod del boton de enlaces
  Escena_MinijuegoVariables.prototype.createConsultaButton = function() {
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




  //funcion mostrar puntaje de la tarea 2
  Escena_MinijuegoVariables.prototype.createFinalScoreBox = function() {
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
  Escena_MinijuegoVariables.prototype.createScoreBox = function() {
  const scoreBox = new Sprite(new Bitmap(250, 40));
  scoreBox.x = 371;
  scoreBox.y = 50;

 
  scoreBox.bitmap.fillRect(0, 0, 200, 40, "#f2c298ff");
  scoreBox.bitmap.textColor = "#000000";
  scoreBox.bitmap.fontFace = 'Arial';
  scoreBox.bitmap.outlineWidth = 0;
  scoreBox.bitmap.fontSize = 18;
  scoreBox.bitmap.drawText("Puntaje actividad: " + _contador, 5, 5, 250, 40, 'left');


  this._scoreBox = scoreBox;
  this.addChild(scoreBox);
};
Escena_MinijuegoVariables.prototype.openConsultaWindow = function() {
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
























      Escena_MinijuegoVariables.prototype.updateDragAndDrop = function() {
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
  Escena_MinijuegoVariables.prototype.resaltarCajasValidas = function(valor) {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              // Resaltar todas las cajas vacías (o añadir lógica específica)
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, 'rgba(100, 255, 100, 0.3)');
              //caja.bitmap.drawText(caja._respuestaCorrecta, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  Escena_MinijuegoVariables.prototype.resetearResaltadoCajas = function() {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, '#ffffffff');//Color de la caja
              //caja.bitmap.drawText(`Caja ${this._cajas.indexOf(caja)+1}`, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  // Actualizar en el método principal update
  Escena_MinijuegoVariables.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
      this.updateDragAndDrop();
      
      if (Input.isTriggered('cancel')) {
          SoundManager.playCancel();
          SceneManager.pop();
      }
  };








Escena_MinijuegoVariables.prototype.crearElementosDeTexto = function() {
  this._elementos = [];
        
const variables = ['Variables', 'Naturaleza', 'Nivel de medicion', 'Categoría', 'Unidad de medida', 'Edad', 'Temperatura', 'Síntomas neurológicos(Si-No) ', 'Contacto con animales(Si-No)', 'Personas por hogar', 'Acceso a agua potable \n (Si-No-Parcial', 'Estado de salud'];
        const posicionesParaLasCajas = [
            {x: 85, y: 130}, {x: 200, y: 130}, {x: 295, y: 130},
            {x: 410, y: 130}, {x: 505, y: 130}, {x: 85, y: 160},
            {x: 75, y: 190}, {x: 55, y: 250}, {x: 55, y: 300},
            {x: 55, y: 360}, {x: 55, y: 420}, {x: 65, y: 520},
            
        ];

        const medidasParaLasCajas = [
            {w: 100, h: 30}, // Variables
            {w: 80, h: 30},  // naturaleza
            {w: 110, h: 30}, // Nivel de medicion
            {w: 90, h: 30},  // categoria
            {w: 100, h: 30},  // unidad de medida
            {w: 80, h: 30},  // Edad
            {w: 70, h: 30},  // Temperatura
            {w: 120, h: 35}, // sintomas neurologicos
            {w: 120, h: 35},  // contacto con animales
            {w: 100, h: 30}, // personas por hogar
            {w: 120, h: 40}, // accesoa agua potable
            {w: 90, h: 30},  // estado de salud
            
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


















    Escena_MinijuegoVariables.prototype.crearElementosArrastrables = function() {
        this._elementos = [];
        
        const valores = ['Cuantitativa', 'Discreta', 'Grados centigrados', 'No aplica', 'Alto', 'Parcial', 'Años', 'Nominal', 'Si', 'Porcentaje', 'Ordinal', 'Continua', 'No', 'Sano', 'Persona', "Medio", "Cualitativa", "Enfermo", "Bajo"];
        const posiciones = [
            {x: 690, y: 120}, {x: 690, y: 145}, {x: 690, y: 170},
            {x: 690, y: 195}, {x: 690, y: 220}, {x: 690, y: 245},
            {x: 690, y: 270}, {x: 690, y: 295}, {x: 690, y: 320},
            {x: 690, y: 345}, {x: 690, y: 370}, {x: 690, y: 390},
            {x: 690, y: 420}, {x: 690, y: 445}, {x: 690, y: 470},
            {x: 690, y: 495}, {x: 690, y: 520}, {x: 690, y: 540},
            {x: 690, y: 570}
        ];

        const medidas = [
            {w: 100, h: 30}, // Cuantitativa
            {w: 80, h: 30},  // Discreta
            {w: 110, h: 30}, // Grados centígrados
            {w: 90, h: 30},  // No aplica
            {w: 60, h: 30},  // Alto
            {w: 80, h: 30},  // Parcial
            {w: 70, h: 30},  // Años
            {w: 100, h: 30}, // Nominal
            {w: 60, h: 30},  // Si
            {w: 100, h: 30}, // Porcentaje
            {w: 100, h: 30}, // Ordinal
            {w: 90, h: 30},  // Continua
            {w: 60, h: 30},  // No
            {w: 70, h: 30},  // Sano
            {w: 90, h: 30},  // Persona
            {w: 80, h: 30},  // Medio
            {w: 110, h: 30}, // Cualitativa
            {w: 90, h: 30},  // Enfermo
            {w: 70, h: 30}   // Bajo
];

    for (let i = 0; i < valores.length; i++) {
        const valor = valores[i];
        const pos = posiciones[i];
        const medida = medidas[i]; //Acceder al ancho y alto específico

        const elemento = new Sprite(new Bitmap(medida.w, medida.h));
        elemento.bitmap.fontSize = 12;
        elemento.bitmap.fontFace = 'Arial';
        elemento.bitmap.outlineWidth = 0;
        elemento.bitmap.outlineColor = 'rgba(0,0,0,0)';
        elemento.bitmap.textColor = "#0b0b0bff";
        elemento.bitmap.drawText(valor, 0, 0, medida.w, medida.h, 'left');

        elemento.x = pos.x;
        elemento.y = pos.y;
        elemento._posicionInicial = {x: pos.x, y: pos.y};
        elemento._valor = valor;
        elemento._arrastrando = false;

        this._elementos.push(elemento);
        this.addChild(elemento);
    }

    };

    Escena_MinijuegoVariables.prototype.crearCajasDestino = function() {
        this._cajas = [];
        
        //const respuestasCorrectas = [
        //    'Cuantitativa', 'Discreta', 'Grados centigrados', 'No aplica', 'Parcial', 'Años', 'Nominal', 'Si', 'Porcentaje', 'Ordinal', 'Continua', 'No', 'Sano', 'Persona', "Cualitativa", "Enfermo",
        //];
        
        const posicionesCajas = [
            // Columna izquierda
            {x: 175, y: 163 }, {x: 175, y: 198}, {x: 175, y: 250},
            {x: 175, y: 310}, {x: 175, y: 360}, {x: 175, y: 420},
            {x: 175, y: 510}, 
            // Columna 2
            {x: 285, y: 163}, {x: 285, y: 198}, {x: 285, y: 250},
            {x: 285, y: 310}, {x: 285, y: 360}, {x: 285, y: 420},
            {x: 285, y: 510},
            //Columna 3
            {x: 398, y: 163}, {x: 398, y: 198}, {x: 398, y: 228},
            {x: 398, y: 263}, {x: 398, y: 298}, {x: 398, y: 328},
            {x: 398, y: 362}, {x: 398, y: 398}, {x: 398, y: 430}, 
            {x: 398, y: 462}, {x: 398, y: 497}, {x: 398, y: 533}, 
            //Columna 4
            {x: 505, y: 160}, {x: 505, y: 195}, {x: 505, y: 250},
            {x: 505, y: 310}, {x: 505, y: 360}, {x: 505, y: 420},
            {x: 505, y: 510}, 
            
        ];

        for (let i = 0; i < 33; i++) {
            const caja = new Sprite(new Bitmap(91, 25));
            caja.bitmap.fillRect(0, 0, 50, 5, '#f28e8eff');
            caja.bitmap.fontSize = 12; // Ajusta según necesidad
            caja.bitmap.drawText(`Suelta ${i+1}`, 0, 0, 70, 5, 'center');
            
            caja.x = posicionesCajas[i].x;
            caja.y = posicionesCajas[i].y;
            //caja._respuestaCorrecta = respuestasCorrectas[i];
            caja._valorActual = null;
            caja._ocupada = false;
            
            this._cajas.push(caja);
            this.addChild(caja);
        }
    };


    Escena_MinijuegoVariables.prototype.getBoxGroups = function() {
    return [
        ['Cuantitativa'],    // caja 1
        ['Cuantitativa'],    // caja 2
        ['Cualitativa'],     // caja 3
        ['Cualitativa'],     // caja 4
        ['Cuantitativa'],    // caja 5
        ['Cualitativa'],     // caja 6
        ['Cualitativa'],     // caja 7
        ['Discreta', 'Continua'], // caja 8
        ['Continua'],        // caja 9
        ['Nominal'],         // caja 10
        ['Nominal'],         // caja 11
        ['Discreta'],        // caja 12
        ['Ordinal'],         // caja 13
        ['Nominal'],         // caja 14
        ['No aplica'],       // caja 15
        ['No aplica'],       // caja 16
        ['Si', 'No'],        // caja 17
        ['Si', 'No'],        // caja 18
        ['Si', 'No'], 
        ['Si', 'No'],        // caja 17       // caja 18
        ['No aplica'],       // caja 19
        ['Si', 'No', 'Parcial'],  
        ['Si', 'No', 'Parcial'], 
        ['Si', 'No', 'Parcial'],     // caja 17 // caja 20
        ['Enfermo', 'Sano'],
        ['Enfermo', 'Sano'], // caja 21
        ['Años'],            // caja 22
        ['Grados centigrados'], // caja 23
        ['Porcentaje'],      // caja 24
        ['Porcentaje'],      // caja 25
        ['Persona'],         // caja 26
        ['Porcentaje'],      // caja 27
        ['Porcentaje']       // caja 28
    ];
};


      Escena_MinijuegoVariables.prototype.crearBotonesInferiores = function() {
      const anchoBoton = 180;
      const altoBoton = 40;
      const self = this;

      // Botón "Cancelar"
      const botonCancelar = new Sprite(new Bitmap(anchoBoton, altoBoton));
      botonCancelar.bitmap.fillRect(0, 0, anchoBoton, altoBoton, '#e74c3c');
      botonCancelar.bitmap.textColor = '#100d0dff';
      botonCancelar.bitmap.fontFace = 'Arial';
      botonCancelar.bitmap.outlineWidth = 0;
      botonCancelar.bitmap.drawText("Cancelar", 0, 0, anchoBoton, altoBoton, 'center');
      botonCancelar.x = Graphics.width / 2 - anchoBoton - 20;
      botonCancelar.y = Graphics.height - altoBoton - 7;

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
      botonValidar.bitmap.textColor = '#070606ff';
      botonValidar.bitmap.fontFace = 'Arial';
      botonValidar.bitmap.outlineWidth = 0;
      botonValidar.bitmap.drawText("Validar Respuestas", 0, 0, anchoBoton, altoBoton, 'center');
      botonValidar.x = Graphics.width / 2 + 20;
      botonValidar.y = Graphics.height - altoBoton - 7;

      
      botonValidar.update = function() {
        Sprite.prototype.update.call(this);
        const x = TouchInput.x;
        const y = TouchInput.y;
          if (TouchInput.isTriggered()) {
            if (x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height) {
                const isValid = self.checkAllAnswers(); 

                if (isValid) {
                _finalScore += _contador;
                const currentVida = $gameVariables.value(4);
                $gameVariables.setValue(4, currentVida + _contador);
                $gameSystem.establecerJuegoCompletado2(true);
                //Refrescar visualmente
                SceneManager._scene._finalScoreBox.bitmap.clear();
                SceneManager._scene._finalScoreBox.bitmap.fillRect(0, 0, 300, 40, "#d5f5e3");
                SceneManager._scene._finalScoreBox.bitmap.textColor = "#000000";
                SceneManager._scene._finalScoreBox.bitmap.drawText("Calificacion: " + _finalScore, 0, 0, 300, 40, 'left');
                alert("✅ Prueba correcta. Se sumaron " + _contador + " puntos al resultado final.");
                } else {
                $gameVariables.setValue(147, $gameVariables.value(147) - 1);
                _contador = Math.max(0, _contador - 1);
                // Verificar si se acabaron los intentos
                if (_contador <= 0 || $gameVariables.value(147) <= 0) {
                   $gameSystem.setLrmzJuegoBloqueado(true);
                   SceneManager.push(Scene_LRMZ_BloqueoFinal);
                   return;
                 }
                alert("❌ Respuestas incorrectas. Se restó 1 punto. Puntaje actual: " + _contador);
                if (_contador === 5) {
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


    // Métodos como validarRespuestas, manejarArrastre, etc.

    Escena_MinijuegoVariables.prototype.validarRespuestas = function() {
        for (let i = 0; i < this._cajas.length; i++) {
            const caja = this._cajas[i];
            if (!caja._ocupada || caja._valorActual !== caja._respuestaCorrecta) {
                return false;
            }
        }
        return true;
    };








      Escena_MinijuegoVariables.prototype.tryDrop = function(elementoArrastrable) {
      let soltadoEnCaja = false;
      const margenError = 30; // Pixeles de tolerancia para el área de soltar

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
              //caja.bitmap.fontSize = elementoArrastrable._valor.includes('%') ? 18 : 22;
              caja.bitmap.fontSize = 12;
              caja.bitmap.fontFace = 'Arial'; // Más fina que la predeterminada
              caja.bitmap.outlineWidth = 0;
              caja.bitmap.outlineColor = 'rgba(0,0,0,0)';

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
  Escena_MinijuegoVariables.prototype.obtenerColorSegunTipo = function(valor) {
      // Colores diferentes para números vs porcentajes
      return valor.includes('%') ? '#f2f4f6ff' : '#fbf9f8ff'; //color al soltar
  };

  Escena_MinijuegoVariables.prototype.crearEfectoSoltado = function(x, y) {
      const efecto = new Sprite(new Bitmap(80, 50));
      efecto.bitmap.fillRect(0, 0, 80, 50, 'rgba(204, 214, 128, 0.5)');
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
   Escena_MinijuegoVariables.prototype.checkAllAnswers = function() {
    const allFilled = this._cajas.every(box => box._ocupada);
    if (!allFilled) {
        console.log("No todas las cajas están llenas");
        return false;
    }

    const expectedValues = this.getBoxGroups();

    for (let i = 0; i < this._cajas.length; i++) {
        const box = this._cajas[i];
        const validOptions = expectedValues[i];
        const actual = String(box._valorActual).trim();
        
        // Normalización para comparación
        const normalizedActual = actual.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedOptions = validOptions.map(opt => 
            String(opt).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        );

        if (!normalizedOptions.includes(normalizedActual)) {
            console.log(`❌ Caja ${i+1}:`, {
                ingresado: actual,
                esperado: validOptions,
                normalizadoIngresado: normalizedActual,
                normalizadoEsperado: normalizedOptions
            });
            return false;
        }
    }
    
    console.log("✅ Todas las respuestas son correctas");
    return true;
};


















 function Scene_LRMZ_BloqueoFinal() {
  this.initialize.apply(this, arguments);
}

Scene_LRMZ_BloqueoFinal.prototype = Object.create(Scene_Base.prototype);
Scene_LRMZ_BloqueoFinal.prototype.constructor = Scene_LRMZ_BloqueoFinal;

Scene_LRMZ_BloqueoFinal.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
};

Scene_LRMZ_BloqueoFinal.prototype.create = function() {
  Scene_Base.prototype.create.call(this);

  // Imagen de fondo
  this._lrmzFondo = new Sprite();
  const bitmapFondo = ImageManager.loadBitmap('img/img_pluging/', 'RetroVariables', false);
  bitmapFondo.addLoadListener(() => {
    this._lrmzFondo.bitmap = bitmapFondo;
    this._lrmzFondo.scale.x = Graphics.width / bitmapFondo.width;
    this._lrmzFondo.scale.y = Graphics.height / bitmapFondo.height;
  });
  this.addChild(this._lrmzFondo);

  // Panel central
  const panelAncho = 500;
  const panelAlto = 250;
  this._lrmzPanel = new Sprite(new Bitmap(panelAncho, panelAlto));
  this._lrmzPanel.bitmap.fontSize = 24;
  this._lrmzPanel.x = (Graphics.width - panelAncho) / 2;
  this._lrmzPanel.y = (Graphics.height - panelAlto) / 2;
  this.addChild(this._lrmzPanel);

  // Botón de cerrar
  const botonAncho = 150;
  const botonAlto = 40;
  this._lrmzBotonCerrar = new Sprite(new Bitmap(botonAncho, botonAlto));
  this._lrmzBotonCerrar.bitmap.fillRect(0, 0, botonAncho, botonAlto, '#e74c3c');
  this._lrmzBotonCerrar.bitmap.drawText("Cerrar", 0, 0, botonAncho, botonAlto, 'center');
  this._lrmzBotonCerrar.x = (Graphics.width - botonAncho) / 2;
  this._lrmzBotonCerrar.y = this._lrmzPanel.y + panelAlto - botonAlto + 175;

  this._lrmzBotonCerrar.update = function() {
    Sprite.prototype.update.call(this);
    if (TouchInput.isTriggered() &&
        TouchInput.x >= this.x && TouchInput.x <= this.x + this.width &&
        TouchInput.y >= this.y && TouchInput.y <= this.y + this.height) {
      SceneManager.goto(Scene_Map);
    }
  };

  this.addChild(this._lrmzBotonCerrar);
};

// Guardar el estado de bloqueo
const _LRMZ_DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
  const contents = _LRMZ_DataManager_makeSaveContents.call(this);
  contents._contador = _contador;
  contents._finalScore = _finalScore;
  contents._lrmzJuegoBloqueado = $gameSystem.lrmzJuegoBloqueado();
  return contents;
};

// Cargar el estado de bloqueo
const _LRMZ_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
  _LRMZ_DataManager_extractSaveContents.call(this, contents);
  _contador = contents._contador || 0;
  _finalScore = contents._finalScore || 0;
  $gameSystem.setLrmzJuegoBloqueado(contents._lrmzJuegoBloqueado || false);
};

// Métodos de acceso para el bloqueo
Game_System.prototype.lrmzJuegoBloqueado = function() {
  return this._lrmzJuegoBloqueado || false;
};

Game_System.prototype.setLrmzJuegoBloqueado = function(valor) {
  this._lrmzJuegoBloqueado = valor;
};

})();