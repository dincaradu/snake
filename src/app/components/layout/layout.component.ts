import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Custom definitions
import { DefaultMatch, DefaultSettings, Directions } from 'src/app/definitions/constants';
import { iMatch } from 'src/app/definitions/match.model';
import { iSettings } from 'src/app/definitions/settings.model';

// Custom services
import { EngineService } from 'src/app/services/engine.service';

@Component({
  selector: 'sg-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  match: iMatch = DefaultMatch;
  settings: iSettings = DefaultSettings;

  subMatch: Subscription;
  subSettings: Subscription;

  constructor(
    private engine: EngineService
  ) {
    this.subMatch = this.engine.match.subscribe(newMatch => {
      this.match = newMatch;
    });
    this.subSettings = this.engine.settings.subscribe(newSettings => {
      this.settings = newSettings;
    });
  }

  ngOnInit(): void {
  }

  getMatchClasses(): any {
    let matchClasses = {
      'you-lost': !this.match.alive,
      'still-playing': this.match.alive
    }

    return matchClasses;
  }

  isMatchPaused(): boolean { 
    return this.match.lastMove == Directions.stop && this.match.alive;
  }

  ngOnDestroy(): void {
    if (this.subMatch) {
      this.subMatch.unsubscribe();
    }
    if (this.subSettings) {
      this.subSettings.unsubscribe();
    }
  }

}
