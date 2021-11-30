import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Custom definitions
import { DefaultSettings } from 'src/app/definitions/constants';
import { iSettings } from 'src/app/definitions/settings.model';

// Custom service
import { EngineService } from 'src/app/services/engine.service';

@Component({
  selector: 'sg-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings: iSettings = DefaultSettings;

  // Subscriptions
  subSettings: Subscription | undefined;

  constructor(
    private engine: EngineService
  ) {
    this.subSettings = this.engine.settings.subscribe((settings: iSettings) => {
      this.settings = settings;
    });
  }

  ngOnInit(): void {
  }

  saveSettings(): void {
    this.engine.set(this.settings);
  }

  resetGame(): void {
    this.engine.init(true);
    this.engine.initSnake(true);
  }

  ngOnDestroy(): void {
    if (this.subSettings) {
      this.subSettings.unsubscribe();
    }
  }

}
