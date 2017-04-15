import { State } from '../interfaces/state';

/**
 * Boot state to set basic game options.
 */
export class BootState extends State {
  preload() {
    this.game.load.image('logo', 'assets/images/logo.png');
  }

  create() {
    this.setScale();

    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.game.state.start('Preload');
  }

  /**
   * Setup propper game scaling.
   */
  private setScale() {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.forcePortrait = true;
    this.game.scale.aspectRatio = 1.28;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  }
}
