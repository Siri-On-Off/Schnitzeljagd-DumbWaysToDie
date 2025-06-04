import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private playerName: string = '';
  private startTimes: number[] = [0, 0, 0, 0];
  private timesSec: number[] = [0, 0, 0, 0];
  private schnitzelPoints: number[] = [0, 0, 0, 0];
  private potatoPoints: number[] = [0, 0, 0, 0];
  private startValue = 0;

  private maxTaskDurationMin = [2, 3, 3, 1];

  setPlayerName(name: string) {
    this.playerName = name;
  }

  getPlayerName(): string {
    return this.playerName;
  }

  start(task: number): void {
    this.startTimes[task] = Date.now();
  }

  stop(task: number, taskCompleted: boolean) {
    const durationSec = Math.round((Date.now() - this.startTimes[task]) / 1000);
    this.timesSec[task] = durationSec;
    this.startTimes[task] = 0;

    if (taskCompleted) {
      this.schnitzelPoints[task] = 1;
    }

    if (durationSec > minToSeconds(this.maxTaskDurationMin[task])) {
      this.potatoPoints[task] = 1;
    }
  }

  printTaskInfo(task: number): string {
    return `Zeit: ${this.timesSec[task]}s, Schnitzel: ${this.schnitzelPoints[task]}, Kartoffeln: ${this.potatoPoints[task]}`;
  }

  printTotal(): string {
    const totalTime = this.getTotalTime();
    const minutes = Math.floor(totalTime / 60).toString().padStart(2, '0');
    const seconds = (totalTime % 60).toString().padStart(2, '0');
    return `Gesamtzeit: ${minutes}:${seconds}, Schnitzel: ${this.getTotalSchnitzel()}, Kartoffeln: ${this.getTotalPotatoes()}`;
  }

  getTotalTime(): number {
    return this.timesSec.reduce((sum, value) => sum + value, this.startValue);
  }

  getTotalSchnitzel(): number {
    return this.schnitzelPoints.reduce((sum, value) => sum + value, this.startValue);
  }

  getTotalPotatoes() :number {
    return this.potatoPoints.reduce((sum, value) => sum + value, this.startValue);
  }

  submitResults(name: string): void {
    const totalTime = this.getTotalTime();
    const schnitzel = this.  getTotalSchnitzel();
    const potato = this.getTotalPotatoes();

    const hours = Math.floor(totalTime / 3600).toString().padStart(2, '0'); // padStart = Ergänzt den String von links mit Nullen, bis er mindestens 2 Zeichen lang ist.
    const minutes = Math.floor((totalTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalTime % 60).toString().padStart(2, '0');

    const url =
      'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc9v68rbCckYwcIekRLOaVZ0Qdm3eeh1xCEkgpn3d7pParfLQ/formResponse';
    const body =
      `entry.1860183935=${encodeURIComponent(name)}` +
      `&entry.564282981=${schnitzel}` +
      `&entry.1079317865=${potato}` +
      `&entry.985590604=${hours}:${minutes}:${seconds}`;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    })
      .then((res) => console.log('Gesendet:', res.status))
      .catch((err) => console.error('Fehler beim Senden:', err));
  }

  reset(): void {
    this.startTimes = [0, 0, 0, 0];
    this.timesSec = [0, 0, 0, 0];
    this.schnitzelPoints = [0, 0, 0, 0];
    this.potatoPoints = [0, 0, 0, 0];
  }
}

function minToSeconds(mins: number): number {
  return mins * 60;
}
