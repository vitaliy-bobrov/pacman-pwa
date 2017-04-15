import { State } from '../interfaces/state';

/**
 * State to load all game resources.
 */
export class PreloadState extends State {
  logo: Phaser.Image;

  preload() {
    // Sets game logo while loading.
    this.logo = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.logo.anchor.set(0.5);
    this.logo.scale.set(this.game.world.width * 0.8 / 609);

    // Tilemap.
    this.load.tilemap('level', 'assets/levels/classic.json', null, Phaser.Tilemap.TILED_JSON);

    // Sprites.
    this.load.image('walls', 'assets/sprites/tiles.png');
    this.load.image('pill', 'assets/sprites/power-pill.png');
    this.load.image('pellet', 'assets/sprites/dot.png');
    this.load.image('cherry', 'assets/sprites/cherry.png');
    this.load.image('strawberry', 'assets/sprites/strawberry.png');
    this.load.image('apple', 'assets/sprites/apple.png');
    this.load.spritesheet('blinky', 'assets/sprites/blinky.png', this.game.tileSize, this.game.tileSize);
    this.load.spritesheet('inky', 'assets/sprites/inky.png', this.game.tileSize, this.game.tileSize);
    this.load.spritesheet('pinky', 'assets/sprites/pinky.png', this.game.tileSize, this.game.tileSize);
    this.load.spritesheet('clyde', 'assets/sprites/clyde.png', this.game.tileSize, this.game.tileSize);
    this.load.spritesheet('pacman', 'assets/sprites/pacman.png', this.game.tileSize, this.game.tileSize);

    // Font.
    this.load.bitmapFont('kong', 'assets/font/kongtext.png', 'assets/font/kongtext.xml');

    // Audio.
    this.load.audio('intro', ['assets/sfx/intro.mp3', 'assets/sfx/intro.ogg']);
    this.load.audio('over', ['assets/sfx/over.mp3', 'assets/sfx/over.ogg']);
    this.load.audio('win', ['assets/sfx/win.mp3', 'assets/sfx/win.ogg']);
    this.load.audio('munch', ['assets/sfx/munch.mp3', 'assets/sfx/munch.ogg']);
    this.load.audio('fruit', ['assets/sfx/fruit.mp3', 'assets/sfx/fruit.ogg']);
    this.load.audio('intermission', ['assets/sfx/intermission.mp3', 'assets/sfx/intermission.ogg']);
    this.load.audio('regenerate', ['assets/sfx/regenerate.mp3', 'assets/sfx/regenerate.ogg']);
    this.load.audio('ghost', ['assets/sfx/ghost.mp3', 'assets/sfx/ghost.ogg']);
    this.load.audio('death', ['assets/sfx/death.mp3', 'assets/sfx/death.ogg']);
  }

  create() {
    this.game.state.start('Game');
  }
}
