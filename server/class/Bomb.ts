import { CRAZY_BOMB_BOOST, CRAZY_BOMB_MAX, CRAZY_BOMB_MIN } from "../../config";
import { pick } from "../../core/pick";
import { EEffect, ESounds } from "../../types";
import { Effect } from "./Effect";
import { Entity } from "./Entity";
import { Explode } from "./Explode";
import { Player } from "./Player";

export class Bomb extends Entity {
  time = Date.now();
  liveTime = 2000;

  isFake = false;
  public radius = 1;

  constructor(
    public player: Player, public isCrazy = false
  ) {
    const x = Math.round(player.x);
    const y = Math.round(player.y);

    super(player.game, x, y);
    this.radius = player.effects.radius;

    if (isCrazy) {
      this.isFake = Math.random() < .1 ? true : false;

      this.liveTime = CRAZY_BOMB_MIN + (
        Math.random() * (CRAZY_BOMB_MAX - CRAZY_BOMB_MIN)
      );

      this.radius = this.radius + (
        Math.random() * (this.radius * CRAZY_BOMB_BOOST - this.radius)
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
      if (this.isFake) {
        this.game.bombs.delete(this);
        this.game.effects.add(
          new Effect(this.game, this.x, this.y, EEffect.FAKE_EXPLODE)
        );
        this.player.game.playersApi.playSound(ESounds.explodeFail);
        return;
      }
      this.player.game.playersApi.playSound(ESounds.explode);
      Explode.run(this);
    }
  }
}