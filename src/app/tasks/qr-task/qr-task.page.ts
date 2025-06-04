import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {ScannerComponent} from "../../scanner/scanner.component";
import {NgIf} from "@angular/common";
import {Haptics} from "@capacitor/haptics";
import {TaskService} from "../../services/task.service";

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
  ],
  standalone: true
})


export class QrTaskComponent implements OnInit {
  scanSuccessful = false;

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.start(0);
  }

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
    this.taskService.stop(0, true);
    this.router.navigateByUrl('/tasks/gps');
  }
}
