import { PacmanGame } from '../';
import { PacmanMode } from '../interfaces/pacman';
import { SFX } from '../interfaces/game';
import { TurningObject } from './turning';

/**
 * Pacman hero.
 */
export class Pacman extends TurningObject {
  mode: PacmanMode;
  sfx: SFX;

  private started = false;
  private startFrame = 0;
  private powerTimer: Phaser.TimerEvent;
  private afterStartFn: Function;

  constructor(game: PacmanGame,
              x: number,
              y: number,
              tileSize: number,
              speed: number) {
    super(game, x, y, 'pacman', 0, tileSize, speed, 16);

    this.setAnimations();
    this.setSFX();
  }

  /**
   * Sets move start hook.
   * @param callback - hook to invoke.
   */
  afterStart(callback: Function) {
    this.afterStartFn = callback;
  }

  /**
   * Move on controls.
   * @param direction - movement direction.
   */
  onControls(direction: number) {
    if (direction !== this.current && this.alive) {
      this.checkDirection(direction);
    }

    if (!this.started && this.turning === direction) {
      this.disablePowerMode();
      this.move(direction);
      this.sfx.munch.play(undefined, undefined, undefined, true);
      this.started = true;
      this.afterStartFn();
    }
  }

  /**
   * Enables power mode.
   * @param time - milliseconds.
   * @param onStart - mode start hook.
   * @param onEnd - mode end hook.
   */
  enablePowerMode(time: number, onStart: Function, onEnd: Function) {
    if (this.mode === 'power') {
      // If already in power mode increase time.
      time += this.game.time.events.duration;
      this.powerTimer.timer.destroy();
    } else {
      this.mode = 'power';
    }

    onStart();

    this.powerTimer = this.game.time.events.add(time, () => {
      this.disablePowerMode();
    });

    this.powerTimer.timer.onComplete.add(() => {
      onEnd();
    });
  }

  /**
   * Disables power mode.
   */
  disablePowerMode() {
    this.mode = 'normal';
  }

  /**
   * Moves object.
   * @param direction - movement direction.
   */
  move(direction: number) {
    super.move(direction);

    this.play('munch');

    this.scale.x = this.scaleSize;
    this.angle = 0;

    if (direction === Phaser.LEFT) {
      this.scale.x = -this.scaleSize;
    } else if (direction === Phaser.UP) {
      this.angle = 270;
    } else if (direction === Phaser.DOWN) {
      this.angle = 90;
    }
  }

  /**
   * Pacman death.
   */
  die() {
    super.die();

    this.stop();
    this.scale.x = this.scaleSize;
    this.angle = 0;
    this.sfx.munch.stop();
    this.play('die');
    this.sfx.death.play();
  }

  /**
   * Pacman resurection.
   */
  respawn() {
    super.respawn();

    this.started = false;
  }

  /**
   * Inits object animations.
   */
  private setAnimations() {
    this.animations.add('munch', [0, 1, 2, 1, 0], 15, true);
    const die = this.animations.add('die', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, false);

    die.onComplete.add(() => {
      this.visible = false;
      this.frame = this.startFrame;

      this.respawn();
    });
  }

  /**
   * Setup object sounds.
   */
  private setSFX() {
    this.sfx = {
      munch: this.game.add.audio('munch', 0.7),
      death: this.game.add.audio('death')
    };
  }
}
