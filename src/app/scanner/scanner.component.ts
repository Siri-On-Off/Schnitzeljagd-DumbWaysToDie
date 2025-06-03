import { Component, OnInit } from '@angular/core';
import { Camera } from "@capacitor/camera";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonText,
  IonTitle,
  IonToolbar,
  Platform
} from "@ionic/angular/standalone";
import {BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";

@Component({
  selector: 'app-scanner',
  standalone: true,
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonText
  ]
})
export class ScannerComponent implements OnInit {
  resultText: string | undefined;
  hasCamera: boolean = false;

  private expectedQrCodeValue: string = 'M335@ICT-BZ';

  constructor(public platform: Platform) {
  }

  async ngOnInit() {
    await this.checkCameraAvailability();
  }

  async checkCameraAvailability() {
    // This checks if running on a real device (iOS or Android)
    if (this.platform.is('hybrid')) {
      try {
        const permissionStatus = await Camera.checkPermissions();
        if (permissionStatus.camera === 'granted') {
          this.hasCamera = true;
        } else {
          const requestResult = await Camera.requestPermissions();
          if (requestResult.camera === 'granted') {
            this.hasCamera = true;
          } else {
            this.hasCamera = false;
            console.warn('Camera permission denied.');
          }
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
    if (this.hasCamera) {
      console.log('Attempting to scan QR code...');
      try {
        const barcodePermissionStatus = await BarcodeScanner.checkPermissions();
        if (barcodePermissionStatus.camera !== 'granted') {
          const requestResult = await BarcodeScanner.requestPermissions();
          if (requestResult.camera !== 'granted') {
            this.resultText = 'Kamera-Berechtigung für den QR-Code-Scanner verweigert.';
            console.warn(this.resultText);
            return;
          }
        }

        // Start the barcode scanner
        const {barcodes} = await BarcodeScanner.scan();

        if (barcodes.length > 0) {
          const scannedValue = barcodes[0].rawValue;
          console.log('Scanned QR code:', this.resultText);

          if (scannedValue === this.expectedQrCodeValue) {
            this.resultText = `QR-Code erfolgreich gescannt: ${scannedValue}. Aufgabe gelöst!`;
            console.log('Task solved: QR code matches!');
          } else {
            this.resultText = `QR-Code gescannt: ${scannedValue}. Das ist nicht der erwartete Code (${this.expectedQrCodeValue}).`;
            console.log('QR code does not match the expected value.');
          }
        } else {
          this.resultText = 'Kein QR-Code erkannt.';
          console.log('No QR code detected.');
        }
      }
      catch (err: any) {
        if (err.message && err.message.includes('User cancelled')) { // Common error for scanner dismissed
          this.resultText = 'QR-Code-Scan abgebrochen.';
        } else if (err.message && err.message.includes('No camera available')) { // Specific camera issue
          this.resultText = 'Keine Kamera für den Scan verfügbar.';
        } else {
          this.resultText = 'Fehler beim Scannen des QR-Codes. Bitte versuchen Sie es erneut.';
        }
      }
    }
  }
}
