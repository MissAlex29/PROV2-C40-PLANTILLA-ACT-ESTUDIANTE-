class Game {
  constructor() {
    //Elemento de la biblioteca P5 DOM-h2 es el tamaño del encabezado
    this.resetTitle = createElement("h2");
    //Boton
    this.resetButton = createButton("");
    //Titulo de la tabla 
    this.leadeboardTitle = createElement("h2");
    //Encabezado para cada jugador 
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }
  //Función para obtener estado de juego de base de datos 
  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value",function(data) {
      gameState = data.val();
    });
  }

  //Método para actualizar base de datos 
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    //Objeto para el jugador 
    player = new Player();
    playerCount = player.getCount();

    //Objeto para el formulario de registro
    form = new Form();
    form.display();

    //Jugador 1 
    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;
    
    //Jugador 2 
    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    
    //Matriz para almacenar ambos jugadores 
    cars = [car1, car2];
    
    //Grupos 
    fuels = new Group();
    powerCoins = new Group();
    

    //Definir posición de los obstáculos 
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    //Agregar sprite de combustible
    this.addSprites(fuels, 4, fuelImage, 0.02);
    
    //Agregar sprite de moneda 
    this.addSprites(powerCoins,18, powerCoinImage, 0.09);
    //agregando sprite de obstáculo en el juego
    
  }

  //Método para agregar Sprites 
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    //Buclé para generar los obstaculos aleatorios. 
    for (var i = 0; i < numberOfSprites; i++) {
      //Creamos variables para coordenadas aleatorias 
      var x, y;
      
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      
      //Creamos objeto
      var sprite = createSprite(x, y);
      //
      //Agregamos imagen
      sprite.addImage("sprite", spriteImage);
      //escalamos y agregamos al grupo
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }
  //Ocultar 
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //Posición del encabezado de reinicio
    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200,40);

    //Posición del botón de renicio 
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230,100);
    
    //Posición del encabezado de puntuación
    this.leadeboardTitle.html("Puntuación");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);
    
    //Posición del encabezado del jugador 1 
    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);
    
    //Posición del encabezado del jugador 2
    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  //Método PLAY
  play() {
    //Oculta el formulario
    this.handleElements();
    this.handleResetButton();
    
    //Obtiene info. del jugador 
    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      
      image(track, 0, -height * 5, width, height * 6);
      
      this.showLeaderboard();
      
      var index = 0; 
      for(var prl in allPlayers){
        index = index + 1;
        
        //Almacenamos las posiciones de la BD 
        var x = allPlayers[prl].positionX;
        var y = height - allPlayers[prl].positionY; 
        
        cars[index-1].position.x = x;
        cars[index-1].position.y = y; 
        
        //Dibujaremos ellipse para cada jugador 
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);    
                    
          //Cambiar posición de la cámara 
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;      
        }
      }      
      //Llamamos función de controles 
      this.handlePlayerControls();
      drawSprites();
    }
  }

  //Método para funcionamiento de botón reinicio
  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {}
      });
      window.location.reload();
    });
  }

  //Muestra quien es el lider 
  showLeaderboard() {
    //Variable para almacenar jugador lider
    var leader1, leader2;
    var players = Object.values(allPlayers);
    //Comprueba si el 1er jugador tiene la posición 1 
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;esta etiqueta se utiliza para mostrar cuatro espacios.
      //Sí se cumple la condición 
      leader1 =
        players[0].rank +
        "&emsp;" +
        //Colocamos el nombre del jugador 1 en 1er lugar
        players[0].name +
        "&emsp;" +
        //Colocamos su puntuación en 1er lugar
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        //Colocamos el nombre del jugador 2 en 2er lugar
        players[1].name +
        "&emsp;" +
        //Colocamos su puntuación en 2do lugar
        players[1].score;
    }
    //Comprueba si el jugador 2 tiene la posición 1 
    if (players[1].rank === 1) {
      //Sí se cumple la condición 
      leader1 =
        players[1].rank +
        "&emsp;" +
        //Colocamos el nombre del jugador 2 en 1er lugar
        players[1].name +
        "&emsp;" +
        //Colocamos su puntuación en 1er lugar
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        //Colocamos el nombre del jugador 1 en 2er lugar
        players[0].name +
        "&emsp;" +
        //Colocamos su puntuación en 2do lugar
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  
  //Función para controles 
  handlePlayerControls() {
    // manejando eventos de teclado
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      //Actualizamos posición del jugador en base de datos 
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      //Actualizamos posición del jugador en base de datos 
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      //Actualizamos posición del jugador en base de datos 
      player.update();
    }
  }

  //Metodo par comprobar la colisión de los tanques de combustible 
  

  //Metodo par comprobar la colisión de las monedas 
  
}
