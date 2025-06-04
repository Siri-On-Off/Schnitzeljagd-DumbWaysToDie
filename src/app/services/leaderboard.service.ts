import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TaskService } from './task.service';

export interface GameResult {
  name: string;
  date: string;
  schnitzel: number;
  potato: number;
  totalTime: number; // in Sekunden
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private key = 'schnitzeljagd_leaderboard';

  constructor(private taskService: TaskService) {}

  async addResult(result: GameResult): Promise<void> {
    const stored = await Preferences.get({ key: this.key });
    const list: GameResult[] = stored.value ? JSON.parse(stored.value) : [];

    list.push(result);

    await Preferences.set({
      key: this.key,
      value: JSON.stringify(list),
    });
  }

  async getResults(): Promise<GameResult[]> {
    const stored = await Preferences.get({ key: this.key });
    return stored.value ? JSON.parse(stored.value) : [];
  }

  async clear(): Promise<void> {
    await Preferences.remove({ key: this.key });
  }
}
