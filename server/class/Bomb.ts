import { CRAZY_BOMB_MAX, CRAZY_BOMB_MIN, CRAZY_BOMB_RADIUS_MAX } from "../../src/config";
import { pick } from "../lib/pick";
import { Entity } from "./Entity";
import { Explode } from "./Explode";
import { Player } from "./Player";

export class Bomb extends Entity {
  time = Date.now();
  liveTime = 2000;

  public radius = 1;

  constructor(
    public player: Player, public isCrazy = false
  ) {
    const x = Math.round(player.x);
    const y = Math.round(player.y);

    super(player.game, x, y);
    this.radius = player.effects.radius;

    if (isCrazy) {
      this.liveTime = CRAZY_BOMB_MIN + (
        Math.random() * (CRAZY_BOMB_MAX - CRAZY_BOMB_MIN)
      );
      this.radius = 1 + (
        Math.random() * (CRAZY_BOMB_RADIUS_MAX - 1)
      ) | 0;
    }
  }

  get info() {
    return pick(this, [
      'x',
      'y',
      'radius',
      'isCrazy',
    ]);
  }

  update(): void {
    const { time, liveTime, game: { waitForRestart } } = this;

    if (Date.now() > time + liveTime && waitForRestart < 0) {
      Explode.run(this);
    }
  }
}