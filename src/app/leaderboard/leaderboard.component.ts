import { Component, OnInit } from '@angular/core';
import { LeaderboardService, GameResult } from '../services/leaderboard.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import {
  IonButton,
  IonButtons,
  IonContent, IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
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
    IonFooter,
    IonButtons,
    IonButton,
    DatePipe,
  ]
})
export class LeaderboardPage implements OnInit {
  results: GameResult[] = [];

  constructor(
    private leaderboard: LeaderboardService,
    private taskService: TaskService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const rawResults = await this.leaderboard.getResults();
    this.results = rawResults.sort((a, b) => {
      if (b.schnitzel !== a.schnitzel) {
        return b.schnitzel - a.schnitzel;
      }
      return a.totalTime - b.totalTime;
    });
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  async startNewGame() {
    const alert = await this.alertController.create({
      header: 'Neues Spiel starten',
      inputs: [
        {
          name: 'playerName',
          type: 'text',
          placeholder: 'Dein Name'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Starten',
          handler: (data) => {
            const name = data.playerName?.trim();
            if (!name) {
              this.showError('Bitte gib einen Namen ein.');
              return false;
            }

            this.taskService.setPlayerName(name);
            this.taskService.reset();

            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl('/tasks/qr');
            });

            return true;
          }
        }
      ]
    });

    await alert.present();
  }
  private async showError(msg: string) {
    const alert = await this.alertController.create({
      header: 'Fehler',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
