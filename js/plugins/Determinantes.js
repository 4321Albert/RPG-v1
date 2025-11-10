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
    Object.defineProperty(window, 'internalScore6', {
        get: function() {
            return $gameVariables.value(154);
        },
        set: function(valor) {
            $gameVariables.setValue(154, valor);
        }
    });

    //let _puntajeTotal = 0;
    //let _juegoTerminado = false;
    let _finalScore = 175; // puntaje final a comulado
    
    // Extensiones del sistema
    Game_System.prototype.juegoCompletado6 = function() {
        return this._juegoCompletoo6=== true;
    };

    Game_System.prototype.establecerjuegoCompletado6 = function(estado) {
        this._juegoCompletoo6= estado;
    };

    Game_System.prototype.juegoBloqueadoo6= function() {
        return this._juegoBloqueadoo6=== true;
    };

    Game_System.prototype.establecerBloqueoo6= function(estado2) {
        this._juegoBloqueadoo6= estado2;
    };

    // Comando del plugin
    //const _comandoOriginal = Game_Interpreter.prototype.pluginCommand;
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(comando, args) {
        _Game_Interpreter_pluginCommand.call(this, comando, args);
        //_comandoOriginal.call(this, comando, args);
        
        if (comando === "Determinantes") {
            if ($gameSystem.juegoBloqueadoo6()) {
                SceneManager.push(Escena_Bloqueooo6);
                return;
            }
            
            if ($gameSystem.juegoCompletado6()) {
                alert("Ya completaste este desafío con la máxima puntuación.");
                return;
            }
            // variable contador 2
            if ($gameVariables.value(155) === 0) {
                $gameVariables.setValue(155, 10) 
            }
            
            if ($gameVariables.value(154) === 0) {
                $gameVariables.setValue(154, 10);
                
            }

            SceneManager.push(Scene_Determinantes);
        }
    };

    // Escena principal del minijuego
    function Scene_Determinantes() {
        this.initialize.apply(this, arguments);
    }

    Scene_Determinantes.prototype = Object.create(Scene_Base.prototype);
    Scene_Determinantes.prototype.constructor = Scene_Determinantes;

    Scene_Determinantes.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_Determinantes.prototype.create = function() {
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
    Scene_Determinantes.prototype.crearFondo = function() {
        this._fondo = new Sprite();
        const imagenFondo = ImageManager.loadBitmap('img/img_pluging/', 'determinantes')
        
        imagenFondo.addLoadListener(() => {
            this._fondo.bitmap = imagenFondo;
            this._fondo.scale.x = Graphics.width / imagenFondo.width;
            this._fondo.scale.y = Graphics.height / imagenFondo.height;
        });
        
        this.addChild(this._fondo);
    };



 








  
  //metod del boton de enlaces
  Scene_Determinantes.prototype.createConsultaButton = function() {
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
  Scene_Determinantes.prototype.createInfoButton = function() {
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
  Scene_Determinantes.prototype.createFinalScoreBox = function() {
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
  Scene_Determinantes.prototype.createScoreBox = function() {
  const scoreBox = new Sprite(new Bitmap(250, 40));
  scoreBox.x = 371;
  scoreBox.y = 50;

 
  scoreBox.bitmap.fillRect(0, 0, 200, 40, "#f2c298ff");
  scoreBox.bitmap.textColor = "#000000";
  scoreBox.bitmap.fontFace = 'Arial';
  scoreBox.bitmap.outlineWidth = 0;
  scoreBox.bitmap.fontSize = 18;
  scoreBox.bitmap.drawText("Puntaje actividad: " + internalScore6, 5, 5, 250, 40, 'left');


  this._scoreBox = scoreBox;
  this.addChild(scoreBox);
};
Scene_Determinantes.prototype.openConsultaWindow = function() {
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
























      Scene_Determinantes.prototype.updateDragAndDrop = function() {
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
  Scene_Determinantes.prototype.resaltarCajasValidas = function(valor) {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              // Resaltar todas las cajas vacías (o puedes añadir lógica específica)
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, 'rgba(100, 255, 100, 0.3)');
              //caja.bitmap.drawText(caja._respuestaCorrecta, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  Scene_Determinantes.prototype.resetearResaltadoCajas = function() {
      for (const caja of this._cajas) {
          if (!caja._ocupada) {
              caja.bitmap.clear();
              caja.bitmap.fillRect(0, 0, caja.width, caja.height, '#fefcfcff');
              //caja.bitmap.drawText(`Caja ${this._cajas.indexOf(caja)+1}`, 0, 0, caja.width, caja.height, 'center');
          }
      }
  };

  // Actualizar en el método principal update
  Scene_Determinantes.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
      this.updateDragAndDrop();
      
      if (Input.isTriggered('cancel')) {
          SoundManager.playCancel();
          SceneManager.pop();
      }
  };

  Scene_Determinantes.prototype.crearElementosDeTexto = function() {
  this._elements = [];
        
const variables = ['Están directamente influenciados por la posición social y afectan la exposición y la vulnerabilidad a los riesgos.​Incluyen las condiciones materiales de vida, factores psicosociales, conductas y estilos de vida, así como el acceso al sistema de salud.​Ejemplo: calidad de la vivienda, disponibilidad de agua potable, hábitos alimenticios, acceso a atención médica.​', 'Son las condiciones sociales, económicas, políticas y culturales que generan las desigualdades en salud.​Incluyen la posición socioeconómica de las personas y las estructuras de poder que influyen en esa posición (sistema político, modelo económico, políticas públicas, estratificación social, género, etnia).​', 'Factores más cercanos en la cadena causal que afectan directamente el estado de salud de las personas. Están relacionados con exposiciones biológicas, conductuales o ambientales inmediatas.​Ejemplo: contacto directo con un agente infeccioso, consumo de tabaco, práctica de actividad física, control de glicemia en un paciente diabético.​'];
        const posicionesParaLasCajas = [
            
            {x: 65, y: 130},   //1
            {x: 283, y: 130}, //2
            {x: 485, y: 130}, //3

            
        ];

        const medidasParaLasCajas = [
            {w: 200, h: 600}, // 1
            {w: 200, h: 600},  // 2
            {w: 200, h: 600}, // 3
];

    for (let i = 0; i < variables.length; i++) {
    const valor = variables[i];
    const pos = posicionesParaLasCajas[i];
    const medida = medidasParaLasCajas[i];

    const texto = new Sprite(new Bitmap(medida.w, medida.h));
    texto.bitmap.fontSize = 17;
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












    Scene_Determinantes.prototype.crearElementosArrastrables = function() {
    this._elementos = [];
    
    const valores = [
        "Determinantes intermedios",
        "Determinantes proximales",
        "Determinantes estructurales"
    ];
    const posiciones = [
        {x: 700, y: 250},
        {x: 700, y: 305},
        {x: 700, y: 360},
    ];

    const anchoMaximo = 100; // ancho máximo antes de hacer salto
    const fontSize = 12;

    for (let i = 0; i < valores.length; i++) {
        const valor = valores[i];
        const pos = posiciones[i];

        // Dividir texto en líneas
        const lineas = this.dividirTextoEnLineas(valor, anchoMaximo, fontSize);

        // Altura dinámica según cantidad de líneas
        const alto = lineas.length * (fontSize + 4);
        const elemento = new Sprite(new Bitmap(anchoMaximo, alto));

        elemento.bitmap.fontSize = fontSize;
        elemento.bitmap.textColor = "#0b0b0bff";
        elemento.bitmap.fontFace = 'Arial';
        elemento.bitmap.outlineWidth = 0;
        elemento.bitmap.outlineColor = 'rgba(0,0,0,0)';

        // Dibujar cada línea centrada
        for (let j = 0; j < lineas.length; j++) {
            elemento.bitmap.drawText(lineas[j], 0, j * (fontSize + 4), anchoMaximo, fontSize + 4, 'left');
        }

        elemento.x = pos.x;
        elemento.y = pos.y;
        elemento._posicionInicial = {x: pos.x, y: pos.y};
        elemento._valor = valor;
        elemento._arrastrando = false;

        this._elementos.push(elemento);
        this.addChild(elemento);
    }
};

// Función auxiliar para dividir texto en varias líneas
Scene_Determinantes.prototype.dividirTextoEnLineas = function(texto, anchoMaximo, fontSize) {
    const tempBitmap = new Bitmap(1, 1);
    tempBitmap.fontSize = fontSize;

    const palabras = texto.split(' ');
    let lineas = [];
    let lineaActual = "";

    for (let i = 0; i < palabras.length; i++) {
        let prueba = lineaActual.length > 0 ? lineaActual + " " + palabras[i] : palabras[i];
        if (tempBitmap.measureTextWidth(prueba) <= anchoMaximo) {
            lineaActual = prueba;
        } else {
            lineas.push(lineaActual);
            lineaActual = palabras[i];
        }
    }
    if (lineaActual.length > 0) {
        lineas.push(lineaActual);
    }

    return lineas;
};












    Scene_Determinantes.prototype.crearCajasDestino = function() {
        this._cajas = [];
        
        const respuestasCorrectas = [
            "Determinantes Intermedios",   // caja 1
            'Determinantes Estructurales ',    // caja 2
            'Determinantes proximales ', 
        ];
        
        const posicionesCajas = [
            // Columna izquierda
            {x: 60, y: 520}, {x: 280, y: 520}, {x: 490, y: 520},
        ];

        for (let i = 0; i < 3; i++) {
            const caja = new Sprite(new Bitmap(180, 40));
            caja.bitmap.fillRect(0, 0, 200, 5, '#f28e8eff');
            caja.bitmap.fontSize = 12; // Ajusta según necesidad
            caja.bitmap.fontFace = 'Arial';
            caja.bitmap.outlineWidth = 0;
            caja.bitmap.outlineColor = 'rgba(0,0,0,0)';
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

    Scene_Determinantes.prototype.getBoxGroups = function() {
    return [
        "Determinantes intermedios",   // caja 1
        "Determinantes estructurales",    // caja 2
        "Determinantes proximales"    // caja 3
        
    ];
};


      Scene_Determinantes.prototype.crearBotonesInferiores = function() {
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
      botonCancelar.y = Graphics.height - altoBoton - 10;

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
      botonValidar.y = Graphics.height - altoBoton - 10;

      
      botonValidar.update = function() {
        Sprite.prototype.update.call(this);
        const x = TouchInput.x;
        const y = TouchInput.y;
          if (TouchInput.isTriggered()) {
            if (x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height) {
                const isValid = self.checkAllAnswers(); 

                if (isValid) {
                _finalScore += internalScore6;
                const currentVida = $gameVariables.value(4);
                $gameVariables.setValue(4, currentVida + internalScore6);
                $gameSystem.establecerjuegoCompletado6(true);
                //Refrescar visualmente
                SceneManager._scene._finalScoreBox.bitmap.clear();
                SceneManager._scene._finalScoreBox.bitmap.fillRect(0, 0, 300, 40, "#d5f5e3");
                SceneManager._scene._finalScoreBox.bitmap.textColor = "#000000";
                SceneManager._scene._finalScoreBox.bitmap.drawText("Calificacion: " + _finalScore, 0, 0, 300, 40, 'left');
                alert("✅ Prueba correcta. Se sumaron " + internalScore6 + " puntos al resultado final.");
                } else {
                $gameVariables.setValue(155, $gameVariables.value(155) - 1);
                internalScore6 = Math.max(0, internalScore6 - 1);
                // Verificar si se acabaron los intentos
                if (internalScore6 <= 0 || $gameVariables.value(155) <= 0) {
                    $gameSystem.establecerBloqueoo6(true);
                    SceneManager.push(Escena_Bloqueooo6);
                    return;
                    }
                alert("❌ Respuestas incorrectas. Se restó 1 punto. Puntaje actual: " + internalScore6);
                if (internalScore6 === 5) {
                    alert("⚠️ CUIDADO: solo te quedan 5 intentos, ve repasa tus notas y continua.")
                    
                }
                
                }

            // Refrescar el texto del puntaje
            if (self._scoreBox) {

              self._scoreBox.bitmap.clear();
              self._scoreBox.bitmap.fillRect(0, 0, 250, 40, "#ffffcc");
              self._scoreBox.bitmap.textColor = "#000000";
              self._scoreBox.bitmap.drawText("Puntaje: " + internalScore6, 0, 0, 250, 40, 'left');
            
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

    Scene_Determinantes.prototype.validarRespuestas = function() {
        for (let i = 0; i < this._cajas.length; i++) {
            const caja = this._cajas[i];
            if (!caja._ocupada || caja._valorActual !== caja._respuestaCorrecta) {
                return false;
            }
        }
        return true;
    };

    // Escena de juego bloqueado
    function Escena_Bloqueooo6() {
        this.initialize.apply(this, arguments);
    }







      Scene_Determinantes.prototype.tryDrop = function(elementoArrastrable) {
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
              caja.bitmap.fontSize = 12;
              caja.bitmap.fontFace = 'Arial'; // Más fina que la predeterminada
              caja.bitmap.outlineWidth = 0;
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
  Scene_Determinantes.prototype.obtenerColorSegunTipo = function(valor) {
      // Colores diferentes para números vs porcentajes
      return valor.includes('%') ? '#f2f4f6ff' : '#fbf9f8ff';
  };

  Scene_Determinantes.prototype.crearEfectoSoltado = function(x, y) {
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
    Scene_Determinantes.prototype.checkAllBoxesFilled = function() {
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



    Scene_Determinantes.prototype.checkAllAnswers = function() {
    const allFilled = this._cajas.every(box => box._ocupada);
    if (!allFilled) return false;

    const expectedValues = this.getBoxGroups();

    for (let i = 0; i < this._cajas.length; i++) {
        const box = this._cajas[i];
        const expected = expectedValues[i].trim().toLowerCase();
        const actual = (box._valorActual || "").trim().toLowerCase();

        if (actual !== expected) {
            console.log(`❌ Caja ${i + 1}: incorrecta - ingresado: "${box._valorActual}", esperado: "${expectedValues[i]}"`);
            return false;
        } else {
            console.log(`✅ Caja ${i + 1}: correcta - valor: "${box._valorActual}"`);
        }
    }

    return true;
};

















  function Escena_Bloqueooo6() {
    this.initialize.apply(this, arguments);
  }

  Escena_Bloqueooo6.prototype = Object.create(Scene_Base.prototype);
  Escena_Bloqueooo6.prototype.constructor = Escena_Bloqueooo6;

  Escena_Bloqueooo6.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Escena_Bloqueooo6.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    // Mostrar imagen de fondo
    this._bg = new Sprite();
    const bgBitmap = ImageManager.loadBitmap('img/img_pluging/', 'determinantesre', false);
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
    contents.internalScore6 = internalScore6;
    contents._finalScore = _finalScore;
    contents._juegoBloqueadoo6= $gameSystem.juegoBloqueadoo6();
    return contents;
  };

  // Cargar estado de bloqueo
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    internalScore6 = contents.internalScore6 || 0;
    _finalScore = contents._finalScore || 0;
    $gameSystem.establecerBloqueoo6(contents._juegoBloqueadoo6|| false);
  };


   
})();S