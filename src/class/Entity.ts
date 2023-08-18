import { Vec2 } from "@/Vec2";

import { Application } from "./Application";
import { Camera } from "./Camera";

export class Entity extends Vec2 {
  created = performance.now();
  parent?: Entity | Application;
  children = new Set<Entity>();

  update(dtime: number, time: number) { }
  render(camera: Camera) { }

  appendChild(entity: Entity) {
    entity.appendTo(this);
  }

  deleteChild(entity: Entity) {
    entity.delete();
  }

  appendTo(parent: Entity | Application) {
    this.delete();
    this.parent = parent;
    parent.children.add(this);
  }

  delete() {
    this.parent?.children.add(this);
    delete this.parent;
  }
}