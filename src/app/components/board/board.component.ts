import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { iMatch } from 'src/app/definitions/match.model';

// Custom service
import { EngineService } from 'src/app/services/engine.service';

// Custom definitions
import { DefaultMatch, DefaultSettings, Directions, Keys } from '../../definitions/constants';
import { iSettings } from '../../definitions/settings.model';

@Component({
  selector: 'sg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  // Definitions
  settings: iSettings = DefaultSettings;
  match: iMatch = DefaultMatch;
  snake: Array<number> = [];
  food: Array<number> = [];

  // Subscriptions
  subSettings: Subscription;
  subMatch: Subscription
  subSnake: Subscription;
  subFood: Subscription;

  constructor(
    public engine: EngineService
  ) {
    // Get the settings
    this.subSettings = this.engine.settings.subscribe((newSettings) => {
      console.log('new settings', newSettings);
      this.settings = newSettings;
    });
    
    // Get the snake
    this.subSnake = this.engine.snake.subscribe((newSnake) => {
      console.log('new snake', newSnake);
      this.snake = newSnake;
    });
    
    // Get the food
    this.subFood = this.engine.food.subscribe((newFood) => {
      console.log('new food', newFood);
      this.food = newFood;
    });
    
    // Get the match
    this.subMatch = this.engine.match.subscribe((newMatch) => {
      console.log('new match', newMatch);
      this.match = newMatch;
    });
  }

  // Start on init
  ngOnInit(): void {
    if (this.match.direction != Directions.stop) {
      this.match.direction = Directions.stop;
      this.engine.setMatch(this.match);
    }
  }

  // List for the keypresses
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let startKeys = [Keys.up, Keys.down, Keys.left, Keys.right];

    if (startKeys.indexOf(event.key.toLowerCase()) > -1 &&
      this.match.lastMove === Directions.stop) {
      this.engine.startSnake();
    }

    switch (event.key.toLowerCase()) {
      // In case of unimplemented key, log to console
      default:
        // console.log(this.engine.interval);
        // console.log(event.key);
        break;

      // UP (if not already going down)
      case Keys.up:
        if (this.match.lastMove != Directions.down) {
          this.match.direction = Directions.up;
        }
        break;
      // DOWN (if not already going up)
      case Keys.down:
        if (this.match.lastMove != Directions.up) {
          this.match.direction = Directions.down;
        }
        break;
      // LEFT (if not already going right)
      case Keys.left:
        if (this.match.lastMove != Directions.right) {
          this.match.direction = Directions.left;
        }
        break;
      // RIGHT (if not already going left)
      case Keys.right:
        if (this.match.lastMove!= Directions.left) {
          this.match.direction = Directions.right; 
        }
        break;

      // SPACE
      case Keys.space:
        this.engine.stopSnake();
        break
    }

    this.engine.setMatch(this.match)
  }

  // Should draw the snake on the board
  isSnake(index = -1): boolean {
    let isSnake = false;

    if (this.snake.indexOf(index) > -1) {
      isSnake = true;
    }

    return isSnake;
  }

  // Should draw the food on the board
  isFood(index = -1): boolean {
    let isFood = false;

    if (this.food[0] == index) {
      isFood = true;
    }

    return isFood;
  }

  // Should draw the snake head on the board
  isSnakeHead(index = -1): boolean {
    let isSnakeHead = false;

    if (this.snake[0] == index) {
      isSnakeHead = true;
    }

    return isSnakeHead;
  }

  isMatchPaused(): boolean { 
    return this.match.lastMove == Directions.stop && this.match.alive;
  }

  // Get inline board styles like width and height
  getBoardStyles(): any {
    let boardStyles = {
      'width.px': (this.settings.width * this.settings.pixelDensity),
      'height.px': (this.settings.height * this.settings.pixelDensity)
    };

    return boardStyles;
  }

  getBoardClasses(): any {
    let boardClasses = {
      'you-lost': !this.match.alive,
      'still-playing': this.match.alive,
      'die-on-border': this.settings.dieOnBorder,
      'paused': this.match.lastMove == Directions.stop && this.match.alive
    }

    return boardClasses;
  }

  // Get each square's classes
  getSquareClasses(squareIdx: number): any {
    let squareClasses = {
      'snake': this.isSnake(squareIdx),
      'head': this.isSnakeHead(squareIdx),
      'food': this.isFood(squareIdx)
    }

    return squareClasses;
  }

  getMatchClasses(): any {
    let matchClasses = {
      'you-lost': !this.match.alive,
      'still-playing': this.match.alive,
      'paused': this.match.lastMove == Directions.stop && this.match.alive
    }

    return matchClasses;
  }

  startNewGame(): void {
    this.engine.newGame(true);
  }

  ngOnDestroy() {
    this.engine.stopSnake();

    if (this.subSettings) {
      this.subSettings.unsubscribe();
    }

    if (this.subSnake) {
      this.subSnake.unsubscribe();
    }

    if (this.subFood) {
      this.subFood.unsubscribe();
    }

    if (this.subMatch) {
      this.subMatch.unsubscribe();
    }
  }
}
