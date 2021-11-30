import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Custom components
import { LayoutComponent } from './components/layout/layout.component';
import { BoardComponent } from './components/board/board.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    LayoutComponent,
    BoardComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
