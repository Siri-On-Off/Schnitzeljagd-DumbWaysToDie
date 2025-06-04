import { Component, OnInit, OnDestroy } from '@angular/core';
import { Device, BatteryInfo } from '@capacitor/device';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss'],
})
export class BatteryComponent implements OnInit, OnDestroy {
  isCharging: boolean | undefined = false;
  taskSuccessful: boolean = false;

  private startTime: number | null = null;
  taskDurationSeconds: number = 0;

  private pollingInterval: any;

  ngOnInit() {
    this.initBatteryCheck();
  }

  ngOnDestroy() {
    clearInterval(this.pollingInterval);
  }

  private async initBatteryCheck() {
    const info: BatteryInfo = await Device.getBatteryInfo();
    this.isCharging = info.isCharging;

    if (!this.isCharging) {
      // Gerät lädt NOCH NICHT → Starte Zeitmessung und Polling
      this.startTime = Date.now();
      this.taskSuccessful = false;
      this.taskDurationSeconds = 0;

      this.pollingInterval = setInterval(() => {
        this.checkBatteryStatus();
      }, 2000);
    } else {
      // Gerät lädt bereits beim Seitenaufruf → Aufgabe sofort abgeschlossen
      this.taskSuccessful = true;
      this.taskDurationSeconds = 0;
      console.log('Gerät lädt schon – Messung übersprungen.');
    }
  }

  private async checkBatteryStatus() {
    const info: BatteryInfo = await Device.getBatteryInfo();

    // Nur wenn vorher false war und jetzt true, messen
    if (!this.isCharging && info.isCharging) {
      this.isCharging = true;
      this.taskSuccessful = true;

      // Finale Dauer in Sekunden berechnen
      if (this.startTime !== null) {
        this.taskDurationSeconds = Math.floor(
          (Date.now() - this.startTime) / 1000
        );
      }

      clearInterval(this.pollingInterval);
      this.startTime = null;

      console.log(
        'Gerät lädt – Aufgabe erfolgreich. Dauer (Sek.):',
        this.taskDurationSeconds
      );
    }
  }
}
