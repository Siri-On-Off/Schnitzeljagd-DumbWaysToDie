import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {GeolocationComponent} from "../../geolocation/geolocation.component";
import {Haptics} from "@capacitor/haptics";
import {NgIf} from "@angular/common";

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
    NgIf
  ],
  standalone: true
})
export class GpsTaskComponent {
  gpsSuccessful = false;

  constructor(private router: Router) {}

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
    this.router.navigateByUrl('/tasks/distance');
  }
}
