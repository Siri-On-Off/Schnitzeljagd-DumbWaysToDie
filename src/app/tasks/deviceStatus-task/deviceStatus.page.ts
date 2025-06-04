import { Component, OnInit } from '@angular/core';
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
export class DeviceStatusTaskComponent implements OnInit {
  devicePluggedIn = false;

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.start(3);
  }

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
    this.router.navigateByUrl('/result');
  }

  cancelGame() {
    this.router.navigateByUrl('/home');
  }

  goToNextTask() {
    this.taskService.stop(3, true);
    this.router.navigateByUrl('/result');
  }
}
