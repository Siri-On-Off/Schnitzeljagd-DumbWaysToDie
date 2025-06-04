import { Component, OnInit } from '@angular/core';
import { LeaderboardService, GameResult } from '../services/leaderboard.service';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    DatePipe
  ]
})
export class LeaderboardPage implements OnInit {
  results: GameResult[] = [];

  constructor(private leaderboard: LeaderboardService) {}

  async ngOnInit() {
    this.results = await this.leaderboard.getResults();
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }
}
