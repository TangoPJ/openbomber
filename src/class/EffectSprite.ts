import { points } from "@/point";
import { toLimit } from "@/toLimit";
import { EEffect } from "@/types";
import deathSrc from "images/death.png";
import fakeSrc from "images/explodeFake.png";

import { Frame } from "./Frame";
import { Sprite } from "./Sprite";

const ANIMATIONS = {
  [EEffect.DEATH]: {
    sprite: new Sprite(deathSrc),
    frames: points('0,0;1,0;2,0;3,0;4,0;5,0;6,0;7,0')
  },
  [EEffect.FAKE_EXPLODE]: {
    sprite: new Sprite(fakeSrc),
    frames: points('0,0;1,0;2,0;3,0;4,0;5,0;6,0;7,0;8,0;9,0;10,0;11,0')
  }
};

const SPEEDS = {
  [EEffect.DEATH]: 100,
  [EEffect.FAKE_EXPLODE]: 50,
};

export class EffectSprite extends Frame {
  type!: EEffect;

  startAnimate = -1;
  created = Date.now();

  update(dtime: number, time: number): void {
    if (this.startAnimate === -1)
      this.startAnimate = time;

    const { sprite, frames } = ANIMATIONS[this.type];
    const frame = (time - this.startAnimate) / SPEEDS[this.type] | 0;
    this.sprite = sprite;
    this.frame.set(frames[toLimit(frame, 0, frames.length - 1)]);
  }
}