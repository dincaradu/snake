import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Custom definitions
import { DefaultSettings, Directions, Keys } from '../definitions/constants';
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

  interval: any;

  constructor() {
    this.init();
    this.initSnake();
  }

  init(newSnake: boolean = false): void {
    console.log('Begin settings init');
    let lsSettings = localStorage.getItem(this.settingsKey);

    if (lsSettings) {
      this.settingsValue = JSON.parse(lsSettings);
    }

    if (newSnake) {
      this.settingsValue.direction = Directions.stop;
    }

    this._settings.next(this.settingsValue);
    console.log('End settings  init');
  }

  get settings() {
    console.log('Get settings');
    return this._settings.asObservable();
  }

  set(settings: iSettings): void {
    console.log('Set settings');
    this.settingsValue = settings;
    this._settings.next(settings);

    localStorage.setItem(this.settingsKey, JSON.stringify(this.settingsValue));
  }

  initSnake(newSnake: boolean = false): void {
    console.log('Begin snake init');
    this.snakeValue = [];
    let lsSnake = localStorage.getItem(this.snakeKey);

    if (lsSnake && !newSnake) {
      this.snakeValue = JSON.parse(lsSnake);
      this._snake.next(this.snakeValue);

      console.log('Load snake from localstorage:', this.snake);
    }

    if (this.snakeValue.length == 0 || newSnake) {
      let startPosition = Math.ceil((this.settingsValue.width * this.settingsValue.height) / 2);

      for (let segment = 0; segment < this.settingsValue.segments; segment++) {
        this.snakeValue.push(startPosition);
        this._snake.next(this.snakeValue);
      }

      console.log('Generate snake on the middle of the board:', this.snakeValue);
    }

    localStorage.setItem(this.snakeKey, JSON.stringify(this.snakeValue));
    console.log('End snake init');
  }

  get snake() {
    console.log('Read snake', this.snakeValue);

    return this._snake.asObservable();
  }

  setSnake(snake: Array<number>): void {
    console.log('Set snake', snake);
    this.snakeValue = snake;
    this._snake.next(snake);

    localStorage.setItem(this.snakeKey, JSON.stringify(this.snakeValue));
  }


  startSnake(): void {
    console.log('Resume the Snake Game');

    this.interval = setInterval(() => {
      this.moveSnake();
    }, this.settingsValue.interval);
  }

  stopSnake(): void {
    console.log('Pause the Snake Game');

    clearInterval(this.interval);
  }

  // Calculate the next move
  moveSnake(): void {
    let head: number = this.snakeValue[0];
    let newHead: number = 0;
    let pristine = true;
    let allDirections = [Directions.up, Directions.down, Directions.left, Directions.right];

    // Calculate the new head
    switch (this.settingsValue.direction) {
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

    // Set Pristing to false if movement is detected
    if (allDirections.indexOf(this.settingsValue.direction) > -1) {
      pristine = false;
    }

    // Make sure there was movement and the game is not paused before updating the snake with 0
    if ((newHead !== 0 && !pristine) || !pristine) {
      // Add the new head and remove the tail
      this.snakeValue.unshift(newHead);
      this.snakeValue.pop();

      // Save the new value of the snake
      this.setSnake(this.snakeValue);
    }
  }

  // Kill the snake
  killTheSnake(): void {
    console.log("The snake died!");
    this.settingsValue.direction = Directions.stop;
    this.stopSnake();
    this.set(this.settingsValue);
  }
}
