import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Haptics } from '@capacitor/haptics';
import { BatteryComponent } from '../../battery/battery.component';
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-device-status-task',
  templateUrl: './deviceStatus.page.html',
  styleUrls: ['./deviceStatus.page.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    BatteryComponent,
  ],
  standalone: true
})
export class DeviceStatusTaskComponent {
  devicePluggedIn = false;

  constructor(private router: Router, private taskService: TaskService) {}

  async onDeviceReady() {
    this.devicePluggedIn = true;
    console.log('Gerätestatus erkannt!');

    setTimeout(async () => {
      try {
        await Haptics.vibrate();
      } catch (error) {
        console.warn('Vibration nicht verfügbar:', error);
      }
    }, 1000);
  }

  skipTask() {
    this.router.navigateByUrl('/home');
  }

  cancelGame() {
    this.router.navigateByUrl('/home');
  }

  goToNextTask() {
    this.taskService.stop(3, true);
    this.router.navigateByUrl('/result');
  }
}
