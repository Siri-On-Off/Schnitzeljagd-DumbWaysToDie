import {Component} from '@angular/core';
import {Camera, CameraResultType} from "@capacitor/camera";
import {IonButton, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

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

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    })
    this.imagePath = image.webPath
  }
}
