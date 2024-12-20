import type { Achivment } from "@ob/server/src/class/Achivment";
import type { Bomb } from "@ob/server/src/class/Bomb";
import type { Effect } from "@ob/server/src/class/Effect";
import type { Explode } from "@ob/server/src/class/Explode";
import type { Player } from "@ob/server/src/class/Player";

export class GameMap {
  #subs = new Set<(m: GameMap) => any>();

  #map!: Uint8Array;
  #bombs!: Bomb['info'][];
  #achivments!: Achivment['info'][];
  #explodes!: Explode['info'][];
  #players!: Player['info'][];
  #positions!: Player['posInfo'][];
  #effects!: Effect['info'][];

  get map() { return this.#map; }
  get bombs() { return this.#bombs; }
  get achivments() { return this.#achivments; }
  get explodes() { return this.#explodes; }
  get players() { return this.#players; }
  get positions() { return this.#positions; }
  get effects() { return this.#effects; }

  set map(v) { this.#map = v; this.update(); }
  set bombs(v) { this.#bombs = v; this.update(); }
  set achivments(v) { this.#achivments = v; this.update(); }
  set explodes(v) { this.#explodes = v; this.update(); }
  set players(v) { this.#players = v; this.update(); }
  set positions(v) { this.#positions = v; this.update(); }
  set effects(v) { this.#effects = v; this.update(); }

  constructor(
    public width: number,
    public height: number
  ) {
    this.reset();
  }

  reset() {
    this.#map = new Uint8Array(this.width * this.height);
    this.#bombs = [];
    this.#achivments = [];
    this.#explodes = [];
    this.#players = [];
    this.#positions = [];
    this.#effects = [];
  }

  get playersWidthPositions() {
    const map = new Map<number, Player['posInfo']>();
    for (const posInfo of this.#positions)
      map.set(posInfo.id, posInfo);

    return this.#players.map((player) => ({
      ...player,
      ...(map.get(player.id) ?? {})
    }));
  }

  update() {
    for (const sub of this.#subs) {
      sub(this);
    }
  }

  subscribe(run: (gameMap: GameMap) => any) {
    this.#subs.add(run);

    return () => {
      this.#subs.delete(run);
    };
  }
}