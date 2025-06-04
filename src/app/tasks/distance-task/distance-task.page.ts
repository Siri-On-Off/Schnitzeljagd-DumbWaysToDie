import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Haptics } from '@capacitor/haptics';
import {DistanceComponent} from "../../distance/distance.component";
import {TaskService} from "../../services/task.service";

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
    DistanceComponent,
  ],
  standalone: true
})
export class DistanceTaskComponent implements OnInit {
  distanceReached = false;

  constructor(private router: Router, private taskService: TaskService) {
  }

  ngOnInit() {
    this.taskService.start(2);
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
    this.router.navigateByUrl('/tasks/deviceStatus');
  }

  cancelGame() {
    this.router.navigateByUrl('/home');
  }

  goToNextTask() {
    this.taskService.stop(2, true);
    this.router.navigateByUrl('/tasks/deviceStatus');
  }
}
