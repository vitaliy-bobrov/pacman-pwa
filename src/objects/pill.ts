import { PacmanGame } from '../';

/**
 * Pellet object.
 */
export class Pill extends Phaser.Sprite {
  constructor(game: PacmanGame,
              x: number,
              y: number) {
    const offset = game.tileSize / 2;

    super(game, x - offset, y - offset, 'pill');
  }

  /**
   * Setup object physics.
   */
  physics() {
    this.game.physics.arcade.enable(this);
    this.body.setSize(16, 16, 0, 0);
    this.body.immovable = true;
    this.anchor.set(0.5);
  }
}
