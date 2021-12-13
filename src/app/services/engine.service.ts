import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Custom definitions
import { DefaultMatch, DefaultSettings, Directions, Keys } from '../definitions/constants';
import { iMatch } from '../definitions/match.model';
import { iSettings } from '../definitions/settings.model';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private _settings = new BehaviorSubject<iSettings>(DefaultSettings);
  private settingsValue = DefaultSettings;
  private settingsKey: string = 'settings';

  private _snake = new BehaviorSubject<Array<number>>([]);
  private snakeValue: Array<number> = [];
  private snakeKey: string = 'snake';

  private _food = new BehaviorSubject<Array<number>>([]);
  private foodValue: Array<number> = [];
  private foodKey: string = 'food';

  private _match = new BehaviorSubject<iMatch>(DefaultMatch);
  private matchValue: iMatch = DefaultMatch;
  private matchKey: string = 'match';

  interval: any;

  constructor() {
    this.newGame();
  }


  // Settings: Init
  init(newSnake: boolean = false): void {
    // console.log('Begin settings init');
    let lsSettings = localStorage.getItem(this.settingsKey);
    let tempSettings = DefaultSettings;

    if (lsSettings && !newSnake) {
      tempSettings = JSON.parse(lsSettings);
    }

    this.set(tempSettings);
    // console.log('End settings  init');
  }

  // Settings: Get
  get settings() {
    return this._settings.asObservable();
  }

  // Settings: Set
  set(settings: iSettings): void {
    // console.log('Set settings');
    this.settingsValue = settings;
    this._settings.next(settings);

    localStorage.setItem(this.settingsKey, JSON.stringify(this.settingsValue));
  }

  // Snake: Init
  initSnake(newSnake: boolean = false): void {
    // console.log('Begin snake init');
    let tempSnake = [];
    let lsSnake = localStorage.getItem(this.snakeKey);

    if (lsSnake && !newSnake) {
      tempSnake = JSON.parse(lsSnake);

      // console.log('Load snake from localstorage:', this.snake);
    } else
      if (tempSnake.length == 0 || newSnake) {
        // Get the real middle position
        let startPosition = this.settingsValue.width * Math.floor(this.settingsValue.height / 2) - Math.floor(this.settingsValue.width / 2);

        for (let segment = 0; segment < this.settingsValue.segments; segment++) {
          tempSnake.push(startPosition)
        }

        // console.log('Generate snake on the middle of the board:', this.snakeValue);
      }

    this.setSnake(tempSnake);
    // console.log('End snake init');
  }

  // Snake: Get
  get snake() {
    return this._snake.asObservable();
  }

  // Snake: Set
  setSnake(snake: Array<number>): void {
    // console.log('Set snake', snake);
    this.snakeValue = snake;
    this._snake.next(snake);

    localStorage.setItem(this.snakeKey, JSON.stringify(this.snakeValue));
  }

  // Snake: Start
  startSnake(): void {
    if (this.matchValue.alive) {
      // console.log('Resume the Snake Game');

      this.interval = setInterval(() => {
        this.moveSnake();
      }, this.matchValue.interval);
    }
  }

  // Snake: Stop
  stopSnake(killTheSnake: boolean = false): void {
    clearInterval(this.interval);
    // console.log('Pause the Snake Game');

    if (killTheSnake) {
      this.matchValue.alive = false;
      this.matchValue.direction = Directions.stop;
      this.matchValue.lastMove = Directions.stop;
      this.setMatch(this.matchValue)
    }
  }

  // Snake: Move
  moveSnake(): void {
    let head: number = this.snakeValue[0];
    let newHead: number = 0;
    let pristine = true;
    let allDirections = [Directions.up, Directions.down, Directions.left, Directions.right];
    let justHadDinner = false;

    // Calculate the new head
    switch (this.matchValue.direction) {
      case Directions.left:
        var rowMinusOne = this.settingsValue.width - 1;

        if (this.settingsValue.dieOnBorder && (head % this.settingsValue.width === 0)) {
          this.killTheSnake();
          pristine = true;
        } else if (!this.settingsValue.dieOnBorder && (head % this.settingsValue.width === 0)) {
          newHead = head + rowMinusOne;
        } else {
          newHead = head - 1;
        }
        break;
      case Directions.right:
        var rowMinusOne = this.settingsValue.width - 1;

        if (this.settingsValue.dieOnBorder && (head % this.settingsValue.width === rowMinusOne)) {
          this.killTheSnake();
          pristine = true;
        } else if (!this.settingsValue.dieOnBorder && (head % this.settingsValue.width === rowMinusOne)) {
          newHead = head - rowMinusOne;
        } else {
          newHead = head + 1;
        }
        break;
      case Directions.up:
        let firstRow = this.settingsValue.width;

        if (this.settingsValue.dieOnBorder && (head < firstRow)) {
          this.killTheSnake();
          pristine = true;
        } else if (!this.settingsValue.dieOnBorder && (head < firstRow)) {
          let toLastRow = ((this.settingsValue.height - 1) * this.settingsValue.width);

          newHead = head + toLastRow;
        } else {
          newHead = head - this.settingsValue.width;
        }
        break;
      case Directions.down:
        let lastRow = ((this.settingsValue.width * this.settingsValue.height) - this.settingsValue.width);

        if (this.settingsValue.dieOnBorder && (head > lastRow)) {
          this.killTheSnake();
          pristine = true;
        } else if (!this.settingsValue.dieOnBorder && (head > lastRow)) {
          let toFirstRow = ((this.settingsValue.height - 1) * this.settingsValue.width);

          newHead = head - toFirstRow;
        } else {
          newHead = head + (this.settingsValue.width * 1);
        }
        break;
    }

    this.matchValue.lastMove = this.matchValue.direction;
    this.setMatch(this.matchValue);

    // Set Pristing to false if movement is detected
    if (allDirections.indexOf(this.matchValue.direction) > -1) {
      pristine = false;
    }

    // Kill the little brat if it's trying to eat itself
    if (this.snakeValue.indexOf(newHead) > -1) {
      this.killTheSnake();
      // as the snake died, skip updating it.
      pristine = true;
    }

    // Flag to skip popping the last element if it just ate
    if (this.foodValue.indexOf(newHead) > -1) {
      justHadDinner = true;
    }

    // Make sure there was movement and the game is not paused before updating the snake with 0
    if ((newHead !== 0 && !pristine) || !pristine) {
      // Add the new head and remove the tail
      this.snakeValue.unshift(newHead);
      // Don't pop the last element if the snake just ate the food pixel
      if (!justHadDinner) {
        this.snakeValue.pop();
      } else {
        this.serveDinner();
      }

      // Save the new value of the snake
      this.setSnake(this.snakeValue);
    }
  }

  // Kill the snake
  killTheSnake(): void {
    // console.log("The snake died!");
    this.stopSnake(true);
  }

  // Food: Init
  initFood(newFood: boolean = false): void {
    let tempFood = [];
    let lsFood = localStorage.getItem(this.foodKey);

    if (lsFood && !newFood) {
      tempFood = JSON.parse(lsFood);
      this.setFood(tempFood)
      // console.log('Load food from localstorage:', this.foodValue);
    } else
      if (tempFood.length == 0 || newFood) {
        this.serveDinner(true);

        // console.log('Generate food on the board:', this.foodValue);
      }
    // console.log('End food init');
  }

  // Food: Get
  get food() {
    return this._food.asObservable();
  }

  // Food: Set
  setFood(food: Array<number>): void {
    // console.log('Set food', food);
    this.foodValue = food;
    this._food.next(food);

    localStorage.setItem(this.foodKey, JSON.stringify(this.foodValue));
  }

  // Food: generate location
  getFoodLocation(): number {
    // console.log('Generate new food location');
    let maxIndex = this.settingsValue.width * this.settingsValue.height - 1;
    let foodLocation = Math.floor(Math.random() * maxIndex);

    // If the coordinates are already occupied, get a new location
    if (!this.isValidFoodLocation(foodLocation)) {
      // console.log('The chosen location is already occupied');
      foodLocation = this.getFoodLocation();
    }

    return foodLocation;
  }

  // Food: Validate location
  isValidFoodLocation(location: number): boolean {
    let isValidFoodLocation = true;

    if (this.snakeValue.indexOf(location) > -1) {
      isValidFoodLocation = false;
    }

    return isValidFoodLocation;
  }

  // Serve dinner
  serveDinner(newGame: boolean = false): void {
    let tempFood = this.foodValue;

    if (!newGame) {
      // Consume the current dinner if it's not a new game
      // console.log('Clear the current plate')

      this.updateScoreBy(1);
      tempFood.shift();
    }

    // Generate the next meal if there aren't any
    if (tempFood.length == 0) {
      tempFood.push(this.getFoodLocation());
    }

    // And update!
    this.setFood(tempFood);
  }

  initMatch(newMatch: boolean = false): void {
    // console.log('Begin match init');
    let tempMatch: iMatch = DefaultMatch;
    let lsMatch = localStorage.getItem(this.matchKey);

    if (lsMatch && !newMatch) {
      // console.log('Load match from localstorage:', this.match);
      tempMatch = JSON.parse(lsMatch);
    }

    this.setMatch(tempMatch);
    // console.log('End match init');
  }

  get match() {
    return this._match.asObservable();
  }

  setMatch(match: iMatch): void {
    // console.log('Set match', match);
    this.matchValue = match;
    this._match.next(this.matchValue);

    localStorage.setItem(this.matchKey, JSON.stringify(this.matchValue));
  }

  updateScoreBy(change: number): void {
    let tempMatch = this.matchValue;

    // Update the score
    tempMatch.score += change;

    // Every 10 points, update the speed, else just update match stats
    if (tempMatch.score % 10 == 0) {
      this.updateInterval(tempMatch);
    } else {
      this.setMatch(tempMatch);
    }
  }

  updateInterval(newMatchValue: iMatch = this.matchValue): void {
    newMatchValue.interval -= 10;
    this.setMatch(newMatchValue);

    this.stopSnake();
    this.startSnake();
  }

  // Game engine: Reset
  newGame(resetEverything: boolean = false): void {
    this.stopSnake();
    this.init(resetEverything);
    this.initMatch(resetEverything);
    this.initSnake(resetEverything);
    this.initFood(resetEverything)
  }

  getSquares(): Array<number> {
    let theSquares = [...Array(this.settingsValue.width * this.settingsValue.height).keys()];

    return theSquares;
  }
}
