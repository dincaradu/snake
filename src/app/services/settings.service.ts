import { Injectable } from '@angular/core';

// Custom definitions
import { DefaultSettings } from '../definitions/constants';
import { iSettings } from '../definitions/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: iSettings = DefaultSettings;
  settingsKey: string = 'settings';
  snake: Array<number> = [];
  snakeKey: string = 'snake';


  constructor() {
    this.init();
    this.initSnake();
  }

  init(): void {
    let lsSettings = localStorage.getItem(this.settingsKey);

    if (lsSettings) {
      this.snake = JSON.parse(lsSettings);
    }
  }

  get(): iSettings {
    return this.settings
  }

  set(settings: iSettings): void {
    this.settings = settings;

    localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
  }

  initSnake(): void {
    let lsSnake = localStorage.getItem(this.snakeKey);

    if (lsSnake) {
      this.snake = JSON.parse(lsSnake);
    }

    if (this.snake.length == 0) {
      let startPosition = Math.ceil((this.settings.width * this.settings.height) / 2);

      for (let segment = 0; segment < this.settings.segments; segment++) {
        this.snake.push(startPosition);
      }
    }
  }

  getSnake(): Array<number> {
    return this.snake;
  }

  setSnake(snake: Array<number>): void {
    this.snake = snake;

    localStorage.setItem(this.snakeKey, JSON.stringify(this.snake));
  }
}
