import { PacmanGame } from '../';

export interface PortalProps {
  i: number;
  target: number;
}

/**
 * Map portal object.
 */
export class Portal extends Phaser.Sprite {
  constructor(game: PacmanGame,
              x: number,
              y: number,
              public width: number,
              public height: number,
              public props: PortalProps) {
    super(game, x, y, null);
  }

  /**
   * Setup object physics.
   */
  physics() {
    this.game.physics.arcade.enable(this);
    this.body.setSize(this.width, this.height, 0, 0);
    this.body.immovable = true;
  }
}
