var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy_running, boy;
var groundImg, ground;
var rabbit, rabbit_running;
var obstaclesGroup, obstacle1Img, obstacle2Img,obstacle3Img, obstacle4Img, obstacle5Img, obstacle;
var score;
var gameOverImg,restartImg;
var invisibleGround;
var jumpSound , checkPointSound, dieSound;


function preload(){
  rabbit_running = loadAnimation("rabbit1.png","rabbit2.png","rabbit3.png","rabbit4.png");

  groundImg = loadImage("background.jpg");

  boy_running = loadAnimation("boy.gif");

  obstacle1Img = loadImage("cone.png");
  obstacle2Img = loadImage("cactus.png");
  obstacle3Img = loadImage("poison.png");
  obstacle4Img = loadImage("rock.png");
  obstacle5Img = loadImage("block.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpointsound.mp3");

  restartImg = loadImage("restart.png");

  gameOverImg = loadImage("gameover.png");


}

function setup() {
  createCanvas(600,300);

  ground = createSprite(0,0,0,0);
  ground.addImage("ground",groundImg);
  ground.scale= 1;
  ground.shapeColor = "white";
  ground.velocityX = -1;

  rabbit = createSprite(200, 200, 600, 10);
  rabbit.addAnimation("running", rabbit_running);
  rabbit.scale = 0.19;
  rabbit.setCollider("rectangle", 0, 0, rabbit.width, rabbit.height)
  rabbit.debug = false;

  boy = createSprite(70, 150, 600, 10);
  boy.addAnimation("running", boy_running);
  boy.scale = 0.4;
  boy.debug = false;

  invisibleGround = createSprite(300, 220, 600, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.4;
  
  restart = createSprite(300, 180);
  restart.addImage(restartImg);
  restart.scale = 0.06;

  obstaclesGroup = createGroup();

  score = 0;
}

function draw() {

  rabbit.velocityY = rabbit.velocityY + 0.8;
  rabbit.collide(invisibleGround);

  boy.velocityY = boy.velocityY + 0.8;
  boy.collide(invisibleGround);

  if(gameState === PLAY){

    boy.visible = true;
    rabbit.visible = true;

    gameOver.visible = false;
    restart.visible = false;

    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    spawnObstacles();
    if(obstaclesGroup.isTouching(boy)){
      boy.velocityY = -12;
    }

    ground.velocityX = -(4 + 3 * score / 100);

    if(score>0 && score%100 === 0){
       checkPointSound.play();
    }
    
    if (ground.x < 0){
      ground.x =ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && rabbit.y >= 150) {
        rabbit.velocityY = -12;
        jumpSound.play();
    }

    if (rabbit.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }

   
  }
   else if (gameState === END) {
    
      gameOver.visible = true;
      restart.visible = true;

      boy.visible = false;
      rabbit.visible = false;
     
      ground.velocityX = 0;
      rabbit.velocityY = 0;

      boy.x = rabbit.x;
      
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      obstaclesGroup.setVelocityXEach(0);

     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
  drawSprites();
  fill("yellow");
  textSize(20);
  text("Score: " + score, 450, 40);

}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  rabbit.changeAnimation("rabbit_running", rabbit_running);
  obstaclesGroup.destroyEach();
  score = 0;
  boy.x = 50;
}

function spawnObstacles(){
  if (frameCount % 90 === 0){
    var obstacle = createSprite(400,190,10,40);
    //to increase the velocity to make it more challenging
    obstacle.velocityX = -6;
    
     //generate random obstacles
     var rand = Math.round(random(1,5));
     switch(rand) {
      case 1: obstacle.addImage(obstacle1Img);
              break;
      case 2: obstacle.addImage(obstacle2Img);
              break;
      case 3: obstacle.addImage(obstacle3Img);
              break;
      case 4: obstacle.addImage(obstacle4Img);
              break;
      case 5: obstacle.addImage(obstacle5Img);
              break;
      default: break;
     }
     obstacle.scale = 0.05;
     obstaclesGroup.add(obstacle);
     obstacle.debug = false;
     obstacle.setCollider("circle", 0, 0, 1);
     }
    }