export interface Wave {
  scatter?: number;
  chase?: number;
}

export interface GameDifficulty {
  multiplier: number;
  powerModeTime: number;
  pacmanSpeed: number;
  ghostSpeed: number;
  wavesDurations: Wave[];
}

export interface SFX {
  [key: string]: Phaser.Sound;
}
