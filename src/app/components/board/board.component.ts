import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Custom service
import { EngineService } from 'src/app/services/engine.service';

// Custom definitions
import { DefaultSettings, Directions, Keys } from '../../definitions/constants';
import { iSettings } from '../../definitions/settings.model';

@Component({
  selector: 'sg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  // Definitions
  settings: iSettings = DefaultSettings;
  snake: Array<number> = [];

  // Subscriptions
  subSnake: Subscription;
  subSettings: Subscription;

  constructor(
    private engine: EngineService
  ) {
    // Get the settings
    this.subSettings = engine.settings.subscribe((newSettings) => {
      this.settings = newSettings;
    });

    // Get the snake
    this.subSnake = this.engine.snake.subscribe((newSnake) => {
      this.snake = newSnake;
    });
  }

  // Start on init
  ngOnInit(): void {
    if (this.settings.direction != Directions.stop) {
      this.settings.direction = Directions.stop;
    }
  }

  // List for the keypresses
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let startKeys = [Keys.up, Keys.down, Keys.left, Keys.right];

    if (startKeys.indexOf(event.key.toLowerCase()) > -1 &&
      this.settings.direction === Directions.stop) {
      this.engine.startSnake();
    }

    switch (event.key.toLowerCase()) {
      // In case of unimplemented key, log to console
      default:
        console.log(this.engine.interval);
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
        this.settings.direction = Directions.stop;
        this.engine.stopSnake();
        break
    }

    this.engine.set(this.settings);
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

  // Get inline board styles like width and height
  getBoardStyles(): any {
    let boardStyles = {
      'width.px': (this.settings.width * this.settings.pixelDensity),
      'height.px': (this.settings.height * this.settings.pixelDensity)
    };

    return boardStyles;
  }

  // Get each square's classes
  getSquareClasses(squareIdx: number): any {
    let squareClasses = {
      'snake': this.isSnake(squareIdx),
      'head': this.isSnakeHead(squareIdx)
    }

    return squareClasses;
  }

  ngOnDestroy() {
    this.engine.stopSnake();

    if (this.subSettings) {
      this.subSettings.unsubscribe();
    }

    if (this.subSnake) {
      this.subSnake.unsubscribe();
    }
  }
}
