import { PacmanGame } from '../';
import { Wave, SFX } from '../interfaces/game';
import { TurningObject } from './turning';
import { GhostMode } from '../interfaces/ghost';

/**
 * Ghosts object boilerplate.
 */
export class Ghost extends TurningObject {
  mode: GhostMode;
  sfx: SFX;
  inGame = false;

  private target = new Phaser.Point();
  private scatterTarget = new Phaser.Point();
  private prevMarker = new Phaser.Point();
  private homeMarker = new Phaser.Point();
  private recoverMode: GhostMode;
  private waveCount = 0;
  private timer: Phaser.Timer = this.game.time.create(false);

  constructor(game: PacmanGame,
              x: number,
              y: number,
              key: string,
              frame: number,
              tileSize: number,
              speed: number,
              target: Phaser.Point,
              public home: Phaser.Point,
              public wavesDurations: Wave[]) {
    super(game, x, y, key, frame, tileSize, speed);

    this.scatterTarget = target;
    this.homeMarker.x = Math.floor(home.x / this.tileSize);
    this.homeMarker.y = Math.floor(home.y / this.tileSize);

    this.setAnimations();
    this.setSFX();
  }

  /**
   * Updates object position.
   * @param map - game map.
   * @param index - layer index.
   */
  updatePosition(map: Phaser.Tilemap, index: number) {
    // Prevent updates if inactive.
    if (!this.inGame && this.mode !== 'dead') {
      return;
    }

    super.updatePosition(map, index);

    // Checks if new grid position.
    if (!Phaser.Point.equals(this.prevMarker, this.marker)) {
      const posibilities = this.getPosibleDirections();

      // Make move decision.
      if (posibilities.length > 1) {
        const choice = this.chooseDirection(posibilities);

        this.checkDirection(choice);
      } else {
        this.move(posibilities[0]);
      }

      this.prevMarker = Object.assign({}, this.marker);
    }

    // If resurect point.
    if (this.mode === 'dead' &&
        Phaser.Point.equals(this.homeMarker, this.marker)) {
      this.disableDeadMode();
    }

    // Prevent to stop.
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.move(this.current);
    }

    if (this.turning !== Phaser.NONE) {
      this.turn();
    }
  }

  /**
   * Respawns ghost.
   */
  respawn() {
    super.respawn();

    this.mode = 'scatter';
    this.restoreSpeed();
    this.inGame = false;
    this.play('walk');
    this.animations.stop('walk', true);
    this.timer.pause();
  }

  /**
   * Ghost death.
   */
  die() {
    super.die();

    this.sfx.death.play();
    this.enableDeadMode();
  }

  /**
   * Enables sensitive mode.
   */
  enableSensetiveMode() {
    if (!this.inGame) {
      return;
    }

    if (this.mode !== 'frightened') {
      this.recoverMode = this.mode;
    }

    this.mode = 'frightened';
    this.play('bored');
    this.updateSpeed(this.speed * 0.5);
    this.timer.pause();
    this.onModeSwitch();
  }

  /**
   * Disables sensitive mode.
   */
  disableSensetiveMode() {
    if (!this.inGame) {
      return;
    }

    this.mode = this.recoverMode;

    this.play('walk');
    this.restoreSpeed();
    this.timer.resume();
    this.onModeSwitch();
  }

  /**
   * Changes sensetive animation.
   */
  normalSoon() {
    if (this.mode === 'frightened') {
      this.play('prenormal');
    }
  }

  /**
   * Updates target to follow.
   * @param target - current target object.
   */
  updateTarget(target: Phaser.Point) {
    if (!this.inGame) {
      return;
    }

    if (this.mode === 'frightened' ||
        this.mode === 'chase') {
      this.target = target;
    }
  }

  /**
   * Ghost game start hook.
   */
  onStart() {
    this.initTimer();
    this.inGame = true;
    this.enableScatterMode();
    this.move(Phaser.LEFT);
  }

  /**
   * Move ghost out of house.
   * @param delay - milliseconds.
   */
  escapeFromHome(delay: number) {
    const fadeOut = this.game.add.tween(this)
      .to({alpha: 0}, 300, 'Linear', false, delay);

    const fadeIn = this.game.add.tween(this)
      .to({alpha: 1}, 300, 'Linear');

    fadeOut.onComplete.addOnce(() => {
      this.reset(this.home.x, this.home.y);
      fadeIn.start();
    });

    fadeIn.onComplete.addOnce(() => {
      this.onStart();
      this.sfx.regenerate.play();
    });

    fadeOut.start();
  }

  /**
   * Gets all possible direction.
   */
  private getPosibleDirections() {
    return this.directions
      .reduce((indexes, point, i) => {
        if (point && point.index === -1 &&
          i !== this.opposites[this.current]) {
          indexes.push(i);
        }

        return indexes;
      }, []);
  }

  /**
   * Make mode decision.
   * @param posibilities - possible directions.
   */
  private chooseDirection(posibilities: number[]): number {
    const sorted = posibilities
      .slice()
      .sort((a: number, b: number) => {
        return Phaser.Point.distance(this.directions[a], this.target) -
               Phaser.Point.distance(this.directions[b], this.target);
      });

    // Random choose mode.
    if (this.mode === 'frightened') {
      return sorted[this.game.rnd.integerInRange(0, sorted.length - 1)];
    }

    // Closests to target.
    return sorted.shift();
  }

  /**
   * Inits object animations.
   */
  private setAnimations() {
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 4, true);
    this.animations.add('bored', [8, 9], 4, true);
    this.animations.add('prenormal', [8, 9, 10, 11], 4, true);
    this.animations.add('dead', [12, 13, 14, 15], 4, true);
  }

  /**
   * Inits objects sounds.
   */
  private setSFX() {
    this.sfx = {
      death: this.game.add.audio('ghost'),
      regenerate: this.game.add.audio('regenerate')
    };
  }

  /**
   * Setup new mode timer.
   */
  private initTimer() {
    this.timer.destroy();
    this.timer = this.game.time.create(false);
  }

  /**
   * Gets mode duration.
   */
  private getWaveDuration(): number {
    return this.wavesDurations.length ? this.wavesDurations[this.waveCount][this.mode] : 0;
  }

  /**
   * Enables scatter mode.
   */
  private enableScatterMode() {
    if (!this.inGame) {
      return;
    }

    this.target = Object.assign({}, this.scatterTarget);
    this.mode = 'scatter';
    this.play('walk');

    const duration = this.getWaveDuration();

    if (duration) {
      this.timer.add(duration, () => {
        this.enableChaseMode();
        this.onModeSwitch();
      });

      this.timer.start();
    }
  }

  /**
   * Enables chase mode.
   */
  private enableChaseMode() {
    if (!this.inGame) {
      return;
    }

    this.mode = 'chase';
    this.play('walk');

    const duration = this.getWaveDuration();

    if (duration) {
      this.waveCount++;

      this.timer.add(duration, () => {
        this.enableScatterMode();
        this.onModeSwitch();
      });
    }
  }

  /**
   * Enables dead mode.
   */
  private enableDeadMode() {
    if (this.mode !== 'frightened') {
      return;
    }

    this.mode = 'dead';

    this.inGame = false;
    this.play('dead');
    this.updateSpeed(this.speed * 0.2);
    this.target = Object.assign({}, this.homeMarker);
    this.onModeSwitch();
  }

  /**
   * Enables normal mode.
   */
  private disableDeadMode() {
    this.mode = this.recoverMode;

    this.play('walk');
    this.sfx.regenerate.play();
    this.alive = true;
    this.inGame = true;
    this.restoreSpeed();
    this.timer.resume();
    this.move(Phaser.LEFT);
  }

  /**
   * Force move direction switch.
   */
  private onModeSwitch() {
    this.checkDirection(this.opposites[this.current]);
  }
}
