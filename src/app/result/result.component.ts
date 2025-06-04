import { Component } from '@angular/core';
import {TotalResult, TaskService} from '../services/task.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    FormsModule,
  ],
})
export class ResultPage {

  private result: TotalResult;

  constructor(
    public taskService: TaskService,
    private leaderboard: LeaderboardService,
    private router: Router
  ) {
    this.result = taskService.getTotalResult();
  }

  async submit() {
    // Name aus TaskService holen (angenommen, du speicherst ihn dort)
    const playerName = this.taskService.getPlayerName();  // Falls nicht vorhanden, dann aus this.name

    // Ergebnis an Google Form senden
    this.taskService.submitResults(playerName);

    // Ergebnis lokal für Leaderboard speichern
    await this.leaderboard.addResult({
      name: playerName,
      date: new Date().toISOString(),
      schnitzel: this.taskService.getTotalSchnitzel(),
      potato: this.taskService.getTotalPotatoes(),
      totalTime: this.taskService.getTotalTimeSec()
    });

    // Zurücksetzen & Navigation
    this.taskService.reset();
    this.router.navigateByUrl('/leaderboard');
  }

  get results() {
    return this.taskService.getTotalResult();
  }

  get totalTime() {
    return this.result.totalTime;
  }

  get schnitzel() {
    return this.result.schnitzel;
  }

  get potatoes() {
    return this.result.potatoes;
  }
}
