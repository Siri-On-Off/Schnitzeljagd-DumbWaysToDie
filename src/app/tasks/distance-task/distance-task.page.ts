import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Haptics } from '@capacitor/haptics';

@Component({
  selector: 'app-distance-task-task',
  templateUrl: './distance-task.page.html',
  styleUrls: ['./distance-task.page.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
  ],
  standalone: true
})
export class DistanceTaskComponent {
  distanceReached = false;

  constructor(private router: Router) {
  }

  async onDistanceReached() {
    this.distanceReached = true;
    console.log('Ziel-Distanz erreicht!');

    setTimeout(async () => {
      try {
        await Haptics.vibrate();
      } catch (error) {
        console.warn('Vibration nicht verfügbar:', error);
      }
    }, 1000);
  }

  skipTask() {
    this.router.navigateByUrl('/tasks/next');
  }

  cancelGame() {
    this.router.navigateByUrl('/home');
  }

  goToNextTask() {
    this.router.navigateByUrl('/tasks/next');
  }
}
