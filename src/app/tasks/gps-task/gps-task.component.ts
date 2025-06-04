import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {ScannerComponent} from "../../scanner/scanner.component";

@Component({
  selector: 'app-qr-task',
  templateUrl: './gps-task.component.html',
  styleUrls: ['./gps-task.component.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    ScannerComponent
  ],
  standalone: true
})
export class GpsTaskComponent {
  constructor(private router: Router) {}

  skipTask() {
    this.router.navigateByUrl('/tasks/next'); // Beispielroute
  }

  cancelGame() {
    this.router.navigateByUrl('/home');
  }

  goToNextTask() {
    this.router.navigateByUrl('/home');
  }
}
