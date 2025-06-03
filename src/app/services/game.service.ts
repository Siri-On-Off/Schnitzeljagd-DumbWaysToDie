// src/app/services/game.service.ts
import { Injectable } from '@angular/core';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private player: Player | null = null;

  setPlayer(name: string) {
    this.player = {
      name,
      startTime: new Date(),
    };
  }

  getPlayer(): Player | null {
    return this.player;
  }

  resetGame() {
    this.player = null;
  }
}
