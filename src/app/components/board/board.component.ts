import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { range } from 'rxjs';

// Custom service
import { SettingsService } from 'src/app/services/settings.service';

// Custom definitions
import { Directions, Keys } from '../../definitions/constants';
import { iSettings } from '../../definitions/settings.interface';

@Component({
  selector: 'sg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  // Definitions
  settings: iSettings;
  snake: Array<number>;
  interval: any;

  constructor(
    private settingsService: SettingsService
  ) {
    // Get the settings
    this.settings = settingsService.get();
    this.snake = this.settingsService.getSnake();
  }

  // Start on init
  ngOnInit(): void {
    this.startSnake();
  }

  // List for the keypresses
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      // In case of unimplemented key, log to console
      default:
        console.log(this.interval);
        console.log(event.key);
        break;

      // UP (if not already going down)
      case Keys.up:
        if (this.settings.direction != Directions.down) {
          this.settings.direction = Directions.up;
        }
        break;
      // DOWN (if not already going up)
      case Keys.down:
        if (this.settings.direction != Directions.up) {
          this.settings.direction = Directions.down;
        }
        break;
      // LEFT (if not already going right)
      case Keys.left:
        if (this.settings.direction != Directions.right) {
          this.settings.direction = Directions.left;
        }
        break;
      // RIGHT (if not already going left)
      case Keys.right:
        if (this.settings.direction != Directions.left) {
          this.settings.direction = Directions.right;
        }
        break;

      // SPACE
      case Keys.space:
        // if (this.settings.direction != Directions.stop) {
        // this.settings.direction = Directions.stop;
        this.stopSnake();
        // } else {

        // }
        break
    }
  }

  startSnake(): void {
    this.interval = setInterval(() => {
      this.moveSnake();
    }, this.settings.interval);
  }

  stopSnake(): void {
    clearInterval(this.interval);
  }

  // Calculate the next move
  moveSnake(): void {
    let head: number = this.snake[0];
    let newHead: number = 0;

    // Calculate the new head
    // TODO: where to go when it's the end of the board
    switch (this.settings.direction) {
      case Directions.left:
        newHead = head - 1;
        break;
      case Directions.right:
        newHead = head + 1;
        break;
      case Directions.up:
        newHead = head - this.settings.width;
        break;
      case Directions.down:
        newHead = head + this.settings.width;
        break;
    }

    // Add the new head and remove the tail
    this.snake.unshift(newHead);
    this.snake.pop();

    // Save the new value of the snake
    this.settingsService.setSnake(this.snake);
  }

  // Should draw the snake on the board
  isSnake(index = -1): boolean {
    let isSnake = false;

    if (this.snake.indexOf(index) > -1) {
      isSnake = true;
    }

    return isSnake;
  }

  // Should draw the snake on the board
  isSnakeHead(index = -1): boolean {
    let isSnakeHead = false;

    if (this.snake[0] == index) {
      isSnakeHead = true;
    }

    return isSnakeHead;
  }

  getBoardStyles(): any {
    let boardStyles = {
      'width.px': (this.settings.width * this.settings.pixelDensity),
      'height.px': (this.settings.height * this.settings.pixelDensity)
    };

    return boardStyles;
  }

  getSquareStyles(squareIdx: number): any {
    let squareStyles = {
      'snake': this.isSnake(squareIdx),
      'head': this.isSnakeHead(squareIdx)
    }

    return squareStyles;
  }

  ngOnDestroy() {
    this.stopSnake();
  }
}
