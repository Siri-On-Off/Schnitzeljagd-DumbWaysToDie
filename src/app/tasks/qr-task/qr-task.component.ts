import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {ScannerComponent} from "../../scanner/scanner.component";

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
    ScannerComponent
  ],
  standalone: true
})
export class QrTaskComponent {
  constructor(private router: Router) {}

  skipTask() {
    // Später: Logik zum Überspringen oder Merken
    this.router.navigateByUrl('/tasks/next'); // Beispielroute
  }

  cancelGame() {
    this.router.navigateByUrl('/home');
  }
}
