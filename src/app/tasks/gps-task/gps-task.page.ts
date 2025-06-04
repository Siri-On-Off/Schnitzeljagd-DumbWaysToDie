import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {GeolocationComponent} from "../../geolocation/geolocation.component";
import {Haptics} from "@capacitor/haptics";
import {NgIf} from "@angular/common";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-qr-task',
  templateUrl: './gps-task.page.html',
  styleUrls: ['./gps-task.page.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    GeolocationComponent,
  ],
  standalone: true
})
export class GpsTaskComponent implements OnInit {
  gpsSuccessful = false;

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.start(1);
  }

  onGpsTaskCompleted() {
    this.gpsSuccessful = true;
    console.log('GPS-Aufgabe abgeschlossen!');
    setTimeout(async () => {
      try {
        await Haptics.vibrate();
      } catch (error) {
        console.warn('Vibration nicht verfügbar:', error);
      }
    }, 1000);
  }

  skipTask() {
    this.router.navigateByUrl('/tasks/distance');
  }

  cancelGame() {
    this.router.navigateByUrl('/home');
  }

  goToNextTask() {
    this.taskService.stop(1, true);
    this.router.navigateByUrl('/tasks/distance');
  }
}
