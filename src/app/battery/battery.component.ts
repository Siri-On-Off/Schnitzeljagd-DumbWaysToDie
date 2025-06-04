import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { Device, BatteryInfo } from '@capacitor/device';
import {TaskService} from "../services/task.service";
import {IonCard, IonCardContent, IonIcon, IonText} from "@ionic/angular/standalone";

@Component({
  selector: 'app-battery',
  standalone: true,
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonText,
    IonIcon
  ]
})
export class BatteryComponent implements OnInit, OnDestroy {

  @Output() deviceStatusEvent = new EventEmitter<void>();

  protected readonly TASK_NUMBER: number = 3;

  isCharging: boolean | undefined = false;
  taskCompleted: boolean = false;

  private pollingInterval: any;
  private started: boolean = false;

  constructor(protected taskService: TaskService) {}

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
      this.taskService.start(this.TASK_NUMBER);
      this.started = true;
      this.taskCompleted = false;

      this.pollingInterval = setInterval(() => {
        this.checkBatteryStatus();
      }, 2000);
    } else {
      // Gerät lädt bereits beim Seitenaufruf → Aufgabe sofort abgeschlossen
      this.taskCompleted = true;
      this.deviceStatusEvent.emit();
      console.log('Gerät war schon am Laden – keine Zeitmessung für Task ' + this.TASK_NUMBER);
    }
  }

  private async checkBatteryStatus() {
    const info: BatteryInfo = await Device.getBatteryInfo();
    const chargingNow = info.isCharging;

    // Nur dann stop() aufrufen, wenn wir einmal wirklich gestartet haben
    if (!this.isCharging && chargingNow && this.started) {
      this.taskCompleted = true;
      // stop() nur ein einziges Mal
      this.taskService.stop(this.TASK_NUMBER, true);
      clearInterval(this.pollingInterval);
      console.log(
        'Gerät beginnt zu laden – Stoppe Task. Info:',
        this.taskService.printTaskInfo(this.TASK_NUMBER)
      );
      this.deviceStatusEvent.emit();
    }

    // Zustand für nächsten Polling-Durchlauf aktualisieren
    this.isCharging = chargingNow;
  }
}
