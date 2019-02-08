import {Color} from "./color.js";
import {Vector} from "./vector.js";
import {Intersector} from "./intersectors/main.js";

export class Raytracer {

  static sampleScene (scene, width, height, bounces) {

  }

  static samplePoint (scene, viewport, bounces) {
    const halfHeight = viewport.height / 2;
    const halfWidth = viewport.width / 2;

    const x = viewport.x / halfWidth - halfWidth;
    const y = viewport.y / halfHeight - halfHeight;

    const ray = Raytracer.getRay(scene.camera, x, y);
    const color = Raytracer.getColor(ray, scene, bounces);
    return color;
  }

  static getRay (camera, x, y) {
    // This is closer to the final solution:
    // const pointOnLens = Camera.getRandomPointOnLens(camera, x, y, width, height);
    // const pointOnSensor = Camera.getPointOnSensor(camera, x, y, width, height);
    // const ray = Vector.subtract(pointOnLens, pointOnSensor);
    const perturbedPoint = Point(x + Math.random(), y + Math.random(), -1);
    return Vector.subtract(perturbedPoint, camera.position);
  }

  static getColor (ray, scene, bounces) {
    const hit = Intersector.getNearestIntersection(ray, scene.entities);
    if (!hit.exists)
      return Raytracer.getEnvironmentColor(ray, scene);

    const { color, scatter = [], override = false } = hit;
    const output =
      override
        ? color
    : (!bounces || !scatter.length)
        ? Color.Black()
        : Color.multiply(color, Raytracer.getColor(ray, scene, bounces - 1));

    return output;
  }

  static getEnvironmentColor (ray, scene) {
    // this is where you would wrap a scene in a spherical environment map
    // (or an environment cube / skybox, if you are in a game)
    // TODO: schema for environment
    return Color.of(128, 128, 255);
  }
}
