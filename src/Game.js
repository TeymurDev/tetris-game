let cursors;

let devArrayText;
let scoreText;
let levelText;
let nextPieceImage;
let gameOverLetters;
let tryAgnLetters;
let btnRetry;
let backgroundMenu;
let instructions;

let frameInterval = 300;
let actualFrameInterval = null;
let map = null;
let ps = null;
let combos = 0;
let score = 0;
let level = 0;
let gameOver = false;

class Game extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.menuGameOver = this.add.group();
    this.imageGroup = this.add.group();
    this.load.image("background", "assets/whiteBackground.png");
    var rect = this.add
      .rectangle(MAP_MARGIN, MAP_MARGIN, MAP_WIDTH, 250, 0x000000)
      .setOrigin(0, 0);
    rect.setDepth(10);

    this.load.image("orange", "assets/black-square.png");
    this.load.image("red", "assets/black-square.png");
    this.load.image("purple", "assets/black-square.png");
    this.load.image("blue", "assets/black-square.png");
    this.load.image("dark_blue", "assets/black-square.png");
    this.load.image("yellow", "assets/black-square.png");
    this.load.image("green", "assets/black-square.png");

    this.load.image("orangeTile", "assets/block_orange.png");
    this.load.image("redTile", "assets/block_red.png");
    this.load.image("purpleTile", "assets/block_violet.png");
    this.load.image("blueTile", "assets/block_blue.png");
    this.load.image("darkBlueTile", "assets/block_pink.png");
    this.load.image("yellowTile", "assets/block_yellow.png");
    this.load.image("greenTile", "assets/block_green.png");
    this.load.image("grayTile", "assets/block_light_blue.png");
  }

  create() {
    map = new Map(this);
    this.add.image(10, 10, "background").setOrigin(0, 0);
    ps = new PieceSet(this);
    map.mapDrawer();

    cursors = this.input.keyboard.createCursorKeys();

    this.drawGui();

    this.frame();
  }

  update() {
    if (!gameOver) {
      document.addEventListener("keydown", this.keyDownHandler, false);
      document.addEventListener("keyup", this.keyUpHandler, false);
    }
  }

  frame() {
    setTimeout(() => {
      if (this.isGameOver()) {
        return;
      }

      this.downCicle();
      map.comboVerify();
      // devArrayText.setText(map.getMap());
      map.mapDrawer(this);
      this.frame();
    }, frameInterval);
  }

  keyDownHandler(event) {
    if (event.keyCode == 39) {
      ps.move("right");
    } else if (event.keyCode == 37) {
      ps.move("left");
    }
    if (event.keyCode == 32) {
      ps.turn("right");
    } else if (event.keyCode == 40) {
      if (frameInterval != 20) actualFrameInterval = frameInterval;
      frameInterval = 20;
    }
  }

  keyUpHandler(event) {
    if (event.keyCode == 40) {
      frameInterval = actualFrameInterval;
    }
  }

  isGameOver() {
    for (var i = 0; i < map.xArrayLength; i++) {
      var value = map.getMapPosition(4, i);
      if (value == 3) {
        gameOver = true;
        this.drawGameOverScreen();
        return true;
      }
    }
    return false;
  }

  drawGameOverScreen() {
    const MENU_GAMEOVER_WIDTH = 350;
    const MENU_GAMEOVER_Y = 600;

    gameOverLetters = this.add.text(
      MENU_GAMEOVER_WIDTH / 2 - 20,
      MENU_GAMEOVER_Y + 10,
      "Game Over",
      { font: "bold 35px Arial", color: "white" }
    );
    tryAgnLetters = this.add.text(
      MENU_GAMEOVER_WIDTH / 2,
      MENU_GAMEOVER_Y + 80,
      "Play Again",
      { font: "bold 25px Arial", color: "white" }
    );
    backgroundMenu = this.add
      .rectangle(
        MAP_WIDTH / 2 - MENU_GAMEOVER_WIDTH / 2,
        580,
        MENU_GAMEOVER_WIDTH,
        180,
        0x808080
      )
      .setOrigin(0, 0);
    btnRetry = this.add
      .rectangle(MAP_WIDTH / 2 - 125, 670, 250, 50, 0x000000)
      .setOrigin(0, 0);

    this.menuGameOver.add(tryAgnLetters);
    this.menuGameOver.add(backgroundMenu);
    this.menuGameOver.add(btnRetry);
    this.menuGameOver.add(gameOverLetters);

    tryAgnLetters.setInteractive({ useHandCursor: true });
    tryAgnLetters.on("pointerdown", () => this.restart());
    gameOverLetters.setDepth(12);
    tryAgnLetters.setDepth(12);
  }

  restart() {
    this.menuGameOver.clear(true);

    frameInterval = 300;
    combos = 0;
    score = 0;
    level = 0;
    gameOver = false;

    map = null;
    map = new Map(this);
    ps = new PieceSet(this);
    this.frame();
  }

  downCicle() {
    if (map.isDownLimit() == true) {
      map.tearDownPiece();
      ps.createAnotherPiece();
      return true;
    }

    ps.downCicle();
    map.downCicle();
    return false;
  }

  addNextPieceImage(next_piece_name) {
    if (nextPieceImage != null) nextPieceImage.remove();
    nextPieceImage = this.add.image(20, 80, next_piece_name).setOrigin(0, 0);
    nextPieceImage.setDepth(12);
  }

  drawGui() {
    var guiRect = this.add
      .rectangle(20, 80, 110, 100, 0x000000)
      .setOrigin(0, 0);
    guiRect.setDepth(12);
    this.addNextPieceImage(ps.next_piece_name);

    instructions = this.add.text(
      550,
      300,
      "***GAME CONTROLS*** \r\n\r\nLeft Arrow - move left \r\nRight Arrow - move right \r\nDown Arrow - hard drop \r\nSpace Bar - rotation",
      { font: "bold 25px Arial", color: "white" }
    );
    instructions.setDepth(12);
  }

  drawDeveloperMap() {
    devArrayText = this.add.text(DEV_X, DEV_Y + 250, map.getMap(), {
      font: "bold 25px Geneva",
      color: "white",
    });
  }

  incrSpeed() {
    combos++;
    if (combos % 2 == 0) {
      level++;
      frameInterval -= 30;
    }
    score += 100;
  }
}

var config = {
  type: Phaser.AUTO,
  width: "150%",
  height: "180%",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: Game,
};

var game = new Phaser.Game(config);
