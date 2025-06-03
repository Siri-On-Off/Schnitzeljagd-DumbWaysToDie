import {Component} from '@angular/core';
import {Camera, CameraResultType} from "@capacitor/camera";
import {IonButton, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
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
    IonButton
  ]
})
export class ScannerComponent {
  constructor() { }

  imagePath?: string;
  resultText: string = '';


  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    })
    this.imagePath = image.webPath
  }

  async scanQRCode() {
    const result = await BarcodeScanner.scan();
    if (result.barcodes.length > 0) {
      this.resultText = result.barcodes[0].rawValue ?? 'Kein Text gefunden';
    } else {
      this.resultText = 'Kein QR-Code erkannt.';
    }
  }
}
