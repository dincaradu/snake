import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code == 'KeyW') {
      this.direction = 'top';
    } else
    if (event.code == 'KeyA') {
      this.direction = 'left';
    } else
    if (event.code == 'KeyD') {
      this.direction = 'right';
    } else
    if (event.code == 'KeyS') {
      this.direction = 'bottom';
    }
  }

  timeout = 100;
  direction = 'left';

  width = 25;
  height = 35;

  snake: Array<number> = [];
  interval: any;

  constructor() {
    let middle = Math.ceil((this.width * this.height) / 2);
    this.snake.push(middle);
    this.snake.push(middle+1);
    this.snake.push(middle+2);
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.moveSnake();
    }, this.timeout);
  }

  moveSnake(): void {
    let head: number = this.snake[0];
    let newHead: number = 0;

    switch (this.direction) {
      case "left":
        newHead = head - 1;
        break;
      case "right":
        newHead = head + 1;
        break;
      case "top":
        newHead = head - this.width;
        break;
        case "bottom":
        newHead = head + this.width;
        break;
    }

    this.snake.unshift(newHead);
    this.snake.pop();
  }

  isSnake(index = -1): boolean {
    let isSnake = false;

    if (this.snake.indexOf(index) > -1) {
      isSnake = true;
    }

    return isSnake;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
