import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {ScannerComponent} from "../../scanner/scanner.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-qr-task',
  templateUrl: './qr-task.component.html',
  styleUrls: ['./qr-task.component.scss'],
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

  onScanSuccess() {
    this.scanSuccessful = true;
    console.log("QR-Scan erfolgreich!");
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
