import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Custom components
import { LayoutComponent } from './components/layout/layout.component';
import { BoardComponent } from './components/board/board.component';

@NgModule({
  declarations: [
    LayoutComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
