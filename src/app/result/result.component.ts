import { Component } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    FormsModule
  ]
})
export class ResultPage {
  name: string = '';

  constructor(public taskService: TaskService, private router: Router) {}

  submit() {
    this.taskService.submitResults(this.name);
    this.taskService.reset();
    this.router.navigateByUrl('/leaderboard');
  }

  get results() {
    return this.taskService.printTotal();
  }
}
