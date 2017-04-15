import { PacmanGame } from '../';

export interface PortalProps {
  i: number;
  target: number;
}

/**
 * Map portal object.
 */
export class Portal extends Phaser.Sprite {
  props: PortalProps;
  width: number;
  height: number;

  constructor(game: PacmanGame,
              x: number,
              y: number,
              width: number,
              height: number,
              props: PortalProps) {
    super(game, x, y, null);

    this.props = props;
    this.width = width;
    this.height = height;
  }

  /**
   * Setup object physics.
   */
  private physics() {
    this.game.physics.arcade.enable(this);
    this.body.setSize(this.width, this.height, 0, 0);
    this.body.immovable = true;
  }
}
