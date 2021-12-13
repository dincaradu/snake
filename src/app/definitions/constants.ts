export const Keys = {
  down: 's',
  left: 'a',
  right: 'd',
  space: ' ',
  up: 'w'
};

export const Directions = {
  down: 'down',
  left: 'left',
  right: 'right',
  stop: 'stop',
  up: 'up'
}

export const DefaultSettings = {
  dieOnBorder: true,
  height: 25,
  interval: 300,
  pixelDensity: 20,
  segments: 3,
  width: 25
}

export const DefaultMatch = {
  alive: true,
  direction: Directions.stop,
  interval: DefaultSettings.interval,
  lastMove: Directions.stop,
  score: 0
}