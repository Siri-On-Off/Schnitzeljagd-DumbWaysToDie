import { Injectable } from '@angular/core';

export interface TotalResult {
  totalTime: string,
  schnitzel: number,
  potatoes: number,
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly MAX_TASK_DURATION_MIN: number[] = [2, 3, 3, 1];
  private readonly NUM_TASKS: number = 3;

  private playerName: string = '';
  private startTimesMs: number[] = [0, 0, 0, 0];
  private timesSec: number[] = [0, 0, 0, 0];
  private schnitzelPoints: number[] = [0, 0, 0, 0];
  private potatoPoints: number[] = [0, 0, 0, 0];

  setPlayerName(name: string) {
    this.playerName = name;
  }

  getPlayerName(): string {
    return this.playerName;
  }

  start(task: number): void {
    this.assertValidTask(task);
    this.startTimesMs[task] = Date.now();
  }

  stop(task: number, taskCompleted: boolean): void {
    this.assertValidTask(task);

    const durationSec = this.msToSec(Date.now() - this.startTimesMs[task]);
    this.timesSec[task] = durationSec;
    this.startTimesMs[task] = 0;

    if (taskCompleted) this.schnitzelPoints[task] = 1;
    if (durationSec > this.minToSec(this.MAX_TASK_DURATION_MIN[task])) {
      this.potatoPoints[task] = 1;
    }
    console.log(`Stopping task ${task} at ${new Date().toISOString()}`);
  }

  printTaskInfo(task: number): string {
    this.assertValidTask(task);
    return `Zeit: ${this.formatTimeMinSec(this.timesSec[task])}, Schnitzel: ${this.schnitzelPoints[task]}, Kartoffeln: ${this.potatoPoints[task]}`;
  }

  getTotalResult(): TotalResult {
    return {
      totalTime: this.formatTimeMinSec(this.getTotalTimeSec()),
      schnitzel: this.getTotalSchnitzel(),
      potatoes: this.getTotalPotatoes()
    }
  }

  getTotalTimeSec(): number {
    return this.sum(this.timesSec);
  }

  getTotalSchnitzel(): number {
    return this.sum(this.schnitzelPoints);
  }

  getTotalPotatoes(): number {
    return this.sum(this.potatoPoints);
  }

  private sum(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0);
  }

  submitResults(name: string): void {
    const totalTime = this.formatTimeHourMinSec(this.getTotalTimeSec());
    const totalSchnitzels = this.getTotalSchnitzel();
    const totalPotatoes = this.getTotalPotatoes();

    const url =
      'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc9v68rbCckYwcIekRLOaVZ0Qdm3eeh1xCEkgpn3d7pParfLQ/formResponse';
    const body =
      `entry.1860183935=${encodeURIComponent(name)}` +
      `&entry.564282981=${totalSchnitzels}` +
      `&entry.1079317865=${totalPotatoes}` +
      `&entry.985590604=${totalTime}`;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    })
      .then((res) => console.log('Gesendet:', res.status))
      .catch((err) => console.error('Fehler beim Senden:', err));
  }

  reset(): void {
    this.startTimesMs = [0, 0, 0, 0];
    this.timesSec = [0, 0, 0, 0];
    this.schnitzelPoints = [0, 0, 0, 0];
    this.potatoPoints = [0, 0, 0, 0];
  }

  private assertValidTask(task: number): void {
    if (task < 0 || task > this.NUM_TASKS) {
      throw new Error(`Ungültiger Aufgaben-Index: ${task}`);
    }
  }

  minToSec(mins: number): number {
    return mins * 60;
  }

  msToSec(ms: number): number {
    return Math.round(ms / 1000);
  }

  private pad(num: number): string {
    // Ergänzt den String von links mit Nullen, bis er mindestens 2 Zeichen lang ist.
    return num.toString().padStart(2, '0');
  }

  formatTimeMinSec(totalSec: number): string {
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  formatTimeHourMinSec(totalSec: number): string {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }
}

