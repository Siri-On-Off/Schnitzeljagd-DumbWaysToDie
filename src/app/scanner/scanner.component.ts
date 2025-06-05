import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { TaskService } from '../services/task.service';
import {
  IonButton,
  IonText,
  Platform
} from "@ionic/angular/standalone";
import {BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";

@Component({
  selector: 'app-scanner',
  standalone: true,
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  imports: [
    IonButton,
    IonText
  ]
})
export class ScannerComponent implements OnInit {
  @Output() scanSuccess = new EventEmitter<void>();
  protected readonly TASK_NUMBER: number = 0;

  resultText: string | undefined;
  hasCamera: boolean = false;
  private expectedQrCodeValue: string = 'M335@ICT-BZ';
  taskCompleted = false;


  constructor(public platform: Platform, protected taskService: TaskService) {}

  async ngOnInit() {
    this.taskService.start(this.TASK_NUMBER);
    await this.checkCameraAvailability();
  }

  async checkCameraAvailability() {
    if (this.platform.is('android')) {
      try {
        const permissionStatus = await BarcodeScanner.checkPermissions();
        if (permissionStatus.camera !== 'granted') {
          const requestResult = await BarcodeScanner.requestPermissions();
          this.hasCamera = requestResult.camera === 'granted';
          if (!this.hasCamera) {
            console.warn('Camera permission denied.');
            this.resultText = 'Kamera-Berechtigung verweigert.';
          }
        } else {
          this.hasCamera = true;
        }
      } catch (e) {
        console.error('Error checking camera permissions:', e);
        this.hasCamera = false;
        this.resultText = 'Zugriff auf die Kamera verweigert oder nicht verfügbar.';
      }
    } else {
      this.hasCamera = false;
      this.resultText = 'QR-Scan ist im Browser nicht direkt verfügbar.';
    }
  }

  async scanQRCode() {
    if (!this.hasCamera) return;

    try {
      const { barcodes } = await BarcodeScanner.scan();

      if (barcodes.length > 0) {
        const scannedValue = barcodes[0].rawValue;
        console.log('Scanned QR code:', scannedValue);

        if (scannedValue === this.expectedQrCodeValue) {
          this.resultText = '';
          this.taskCompleted = true;
          this.scanSuccess.emit();
          this.taskService.stop(this.TASK_NUMBER, true);
          console.log(this.taskService.printTaskInfo(this.TASK_NUMBER));
        } else {
          this.resultText = 'Das ist nicht der erwartete Code.';
        }
      } else {
        this.resultText = 'Kein QR-Code erkannt.';
      }
    } catch (err: any) {
      if (err.message?.includes('User cancelled')) {
        this.resultText = 'QR-Code-Scan abgebrochen.';
      } else if (err.message?.includes('No camera available')) {
        this.resultText = 'Keine Kamera für den Scan verfügbar.';
      } else {
        this.resultText = 'Fehler beim Scannen des QR-Codes. Bitte versuchen Sie es erneut.';
      }
    }
  }
}
