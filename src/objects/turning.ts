import { PacmanGame } from '../';

/**
 * Tuning objects base class.
 */
export abstract class TurningObject extends Phaser.Sprite {
  /**
   * Shout it turn.
   */
  turning = Phaser.NONE;

  /**
   * Current move di/rection.
   */
  current = Phaser.NONE;

  /**
   * Position on map grid.
   */
  marker = new Phaser.Point();

  /**
   * Sprite scale number.
   */
  scaleSize = 1.5;

  /**
   * Current surrounding map.
   */
  directions = [ null, null, null, null, null ];

  /**
   * Opposite direction map.
   */
  opposites = [
    Phaser.NONE,
    Phaser.RIGHT,
    Phaser.LEFT,
    Phaser.DOWN,
    Phaser.UP
  ];

  /**
   * Currect object speed.
   */
  private currentSpeed: number;

  /**
   * Resurrection point.
   */
  private respawnPoint = new Phaser.Point();

  /**
   * Turn point on map grid.
   */
  private turnPoint = new Phaser.Point();

  constructor(game: PacmanGame,
              x: number,
              y: number,
              key: string,
              frame: number,
              public tileSize: number,
              public speed: number,
              private threshold = 4) {
    super(game, x, y, key, frame);

    this.respawnPoint.x = x;
    this.respawnPoint.y = y;
    this.currentSpeed = speed;

    this.physics();
    this.game.world.add(this);
  }

  /**
   * Updates object position.
   * @param map - game map.
   * @param index - layer index.
   */
  updatePosition(map: Phaser.Tilemap, index: number) {
    this.setMarker();
    this.updateSensor(map, index);
  }

  /**
   * Updates map grid position.
   */
  setMarker() {
    this.marker.x = Phaser.Math.snapToFloor(Math.floor(this.x), this.tileSize) / this.tileSize;
    this.marker.y = Phaser.Math.snapToFloor(Math.floor(this.y), this.tileSize) / this.tileSize;
  }

  /**
   * Updates object surroundings.
   * @param map - game map.
   * @param index - layer index.
   */
  updateSensor(map: Phaser.Tilemap, index: number) {
    this.directions[1] = map.getTileLeft(index, this.marker.x, this.marker.y);
    this.directions[2] = map.getTileRight(index, this.marker.x, this.marker.y);
    this.directions[3] = map.getTileAbove(index, this.marker.x, this.marker.y);
    this.directions[4] = map.getTileBelow(index, this.marker.x, this.marker.y);
  }

  /**
   * Checks move possibility.
   * @param turnTo - movement direction.
   */
  checkDirection(turnTo: number) {
    if (this.turning === turnTo ||
      this.directions[turnTo] === null ||
      this.directions[turnTo].index !== -1) {
      return;
    }

    if (this.current === this.opposites[turnTo]) {
      this.move(turnTo);
    } else {
      this.turning = turnTo;

      // Adjust point to map grid.
      this.turnPoint.x = (this.marker.x * this.tileSize) + this.tileSize / 2;
      this.turnPoint.y = (this.marker.y * this.tileSize) + this.tileSize / 2;
    }
  }

  /**
   * Moves object.
   * @param direction - movement direction.
   */
  move(direction: number) {
    let speed = this.currentSpeed;

    if (direction === Phaser.LEFT || direction === Phaser.UP) {
      speed = -speed;
    }

    if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
      this.body.velocity.x = speed;
    } else {
      this.body.velocity.y = speed;
    }

    this.current = direction;
  }

  /**
   * Turns object.
   */
  turn(): boolean {
    const cx = Math.floor(this.x);
    const cy = Math.floor(this.y);

    if (!Phaser.Math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) ||
        !Phaser.Math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
        return false;
    }

    this.x = this.turnPoint.x;
    this.y = this.turnPoint.y;

    this.body.reset(this.turnPoint.x, this.turnPoint.y);

    this.move(this.turning);
    this.turning = Phaser.NONE;

    return true;
  }

  /**
   * Stops object.
   */
  stop() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;
  }

  /**
   * Make object dead.
   */
  die() {
    this.alive = false;
  }

  /**
   * Resurrect object.
   */
  respawn() {
    this.stop();
    this.reset(this.respawnPoint.x, this.respawnPoint.y);
    this.body.x = this.x;
    this.body.y = this.y;
    this.alive = true;
    this.visible = true;
  }

  /**
   * Updates object speed.
   * @param value - new speed.
   */
  updateSpeed(value: number) {
    this.currentSpeed = value;
  }

  /**
   * Restores base speed.
   */
  restoreSpeed() {
    this.currentSpeed = this.speed;
  }

  /**
   * Teleports object.
   * @param portalX - entry portal x.
   * @param portalY - entry portal y.
   * @param targetX - out portal x.
   * @param targetY -out portal y.
   */
  teleport(portalX: number, portalY: number, targetX: number, targetY: number) {
    let x: number;
    let y: number;

    if (portalX === targetX || portalX > targetX) {
      x = targetX + this.tileSize / 2;
    } else {
      x = targetX - this.tileSize / 2;
    }

    if (portalY === targetY || portalY > targetY) {
      y = targetY + this.tileSize / 2;
    } else {
      y = targetY - this.tileSize / 2;
    }

    this.reset(x, y);
    this.move(this.current);
  }

  /**
   * Setup object physics.
   */
  private physics() {
    this.anchor.set(0.5);
    this.scale.set(this.scaleSize);

    this.game.physics.arcade.enable(this);
    this.body.setSize(this.tileSize / 2, this.tileSize / 2, this.tileSize / 4, this.tileSize / 4);
  }
}
