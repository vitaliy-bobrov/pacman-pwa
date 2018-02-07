export function getObjectsByType(type: string, map: Phaser.Tilemap, layer: string): any[] {
  return map.objects[layer]
    .filter(element => element.type === type);
}

export function getRespawnPoint(name: string, map: Phaser.Tilemap, layer = 'objects'): Phaser.Point {
  const { x, y } = map.objects[layer]
    .filter(element => element.type === 'respawn' && element.name === name)
    .shift();

  return { x, y } as Phaser.Point;
}

export function getTargetPoint(name: string, map: Phaser.Tilemap, layer = 'objects'): Phaser.Point {
  const { x, y } = map.objects[layer]
    .filter(element => element.type === 'target' && element.name === name)
    .shift();

  return { x, y } as Phaser.Point;
}
