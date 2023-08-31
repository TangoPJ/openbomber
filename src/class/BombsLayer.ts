import { OUT_FRAME } from "config";
import { createUpdateDelete } from "library/createUpdateDelete";

import { BombSprite } from "./BombSprite";
import { Entity } from "./Entity";

import type { Game } from "./Game";
export class BombsLayer extends Entity {
  constructor(public game: Game) {
    super(0, 0);
    this.appendTo(game);
  }

  bombs = new Map<number, BombSprite>();

  update(dtime: number, time: number): void {
    createUpdateDelete(
      this.game.bombs,
      this.bombs,
      () => (
        new BombSprite()
          .appendTo(this)
      ),
      ({ x, y, isCrazy, isRadio }, bomb) => {
        bomb.set(x, y).times(OUT_FRAME);
        bomb.isCrazy = isCrazy;
        bomb.isRadio = isRadio;
      },
      (bomb) => {
        bomb.delete();
      }
    );
  }
}