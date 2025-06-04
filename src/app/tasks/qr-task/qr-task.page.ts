import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {ScannerComponent} from "../../scanner/scanner.component";
import {NgIf} from "@angular/common";
import {Haptics} from "@capacitor/haptics";

@Component({
  selector: 'app-qr-task',
  templateUrl: './qr-task.page.html',
  styleUrls: ['./qr-task.page.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    ScannerComponent,
    NgIf,
  ],
  standalone: true
})


export class QrTaskComponent {
  scanSuccessful = false;

  constructor(private router: Router) {}

  async onScanSuccess() {
    this.scanSuccessful = true;
    console.log("QR-Scan erfolgreich!");

    setTimeout(async () => {
      try {
        await Haptics.vibrate();
      } catch (error) {
        console.warn('Vibration nicht verfügbar:', error);
      }
    }, 1000);
  }

  skipTask() {
    this.router.navigateByUrl('/tasks/gps');
  }

  cancelGame() {
    this.router.navigateByUrl('/home');
  }

  goToNextTask() {
    this.router.navigateByUrl('/tasks/gps');
  }
}
