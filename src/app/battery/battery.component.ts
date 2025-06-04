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
    // Starte in jedem Fall die Aufgabe und das Polling
    this.taskService.start(this.TASK_NUMBER);
    this.started = true;
    this.taskCompleted = false;

    const info: BatteryInfo = await Device.getBatteryInfo();
    this.isCharging = info.isCharging;
    console.log('Initialer Ladezustand:', this.isCharging);

    // Polling alle 2 Sekunden starten
    this.pollingInterval = setInterval(() => {
      this.checkBatteryStatus();
    }, 2000);
  }

  private async checkBatteryStatus() {
    const info: BatteryInfo = await Device.getBatteryInfo();
    const chargingNow = info.isCharging;

    console.log(`Vorher: ${this.isCharging}, Jetzt: ${chargingNow}`);

    if (!this.isCharging && chargingNow && this.started) {
      // Zustand hat sich von "nicht ladend" zu "ladend" geändert
      this.taskCompleted = true;
      this.taskService.stop(this.TASK_NUMBER, true);
      clearInterval(this.pollingInterval);
      this.deviceStatusEvent.emit();
      console.log('Ladevorgang erkannt – Aufgabe abgeschlossen in Sekunden:', this.taskService.printTaskInfo(this.TASK_NUMBER));
    }

    // Sonderfall: Gerät hat bereits beim Init geladen → direkt beim ersten Check stoppen
    if (this.isCharging === chargingNow && chargingNow && !this.taskCompleted && this.started) {
      this.taskCompleted = true;
      this.taskService.stop(this.TASK_NUMBER, true);
      clearInterval(this.pollingInterval);
      this.deviceStatusEvent.emit();
      console.log('Gerät hat bereits beim Init geladen – Aufgabe abgeschlossen in Sekunden:', this.taskService.printTaskInfo(this.TASK_NUMBER));
    }

    // Zustand für nächsten Durchlauf speichern
    this.isCharging = chargingNow;
  }
}
