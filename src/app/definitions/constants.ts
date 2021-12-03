export const Keys = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
  space: ' '
};

export const Directions = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
  stop: 'stop'
}

export const DefaultSettings = {
  direction: Directions.stop,
  dieOnBorder: true,
  height: 25,
  interval: 300,
  segments: 3,
  width: 25,
  pixelDensity: 20
}

export const DefaultMatch = {
  lastMove: DefaultSettings.direction,
  alive: true,
  score: 0,
  interval: DefaultSettings.interval
}