import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Vector2,
  Mesh,
  BoxGeometry,
  Raycaster,
  Intersection,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  MeshBasicMaterial,
  BoxBufferGeometry,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef<HTMLDivElement>;
  @ViewChild('label') label: LabelComponent;

  @Input() color: string = '#39acdb';
  renderer = new WebGLRenderer({ antialias: true });
  scene: Scene = null;
  camera: PerspectiveCamera = null;
  orbitControls: OrbitControls;
  orbitControlsStarted: boolean = false;
  geometry = new BoxGeometry(1, 1, 1);
  selection: LineSegments;
  raycaster = new Raycaster();

  constructor() {}

  addBox(position: Vector3) {
    const edgesMaterial = new LineBasicMaterial({
      color: 0x000000,
    });
    const edgeGeometry = new BoxBufferGeometry(1.001, 1.001, 1.001);
    const edges = new EdgesGeometry(edgeGeometry);
    const edgesMesh = new LineSegments(edges, edgesMaterial);

    const material = new MeshBasicMaterial({ color: this.color });
    const box = new Mesh(this.geometry, material);
    box.position.addVectors(position, new Vector3());
    box.name = 'box';
    box.add(edgesMesh);
    this.scene.add(box);
  }

  getMousePos(event: MouseEvent) {
    return new Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  }

  getClosest(mouse: Vector2): Intersection | null {
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersections = this.raycaster.intersectObjects(
      this.scene.children.filter((object) => object.name === 'box'),
      false
    );

    if (!intersections || intersections.length === 0) return null;

    const closestIntersection = intersections.reduce((closest, intersection) =>
      intersection.distance < closest.distance ? intersection : closest
    );

    return closestIntersection;
  }

  ngOnInit(): void {
    this.renderer.setClearColor('#e5e5e5');
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Default camera position and rotation
    this.camera.position.z = 3;
    this.camera.position.y = 2;
    this.camera.position.x = 2;
    this.camera.rotation.y = -30;

    this.addBox(new Vector3(0, 0, 0));

    const material = new LineBasicMaterial({
      color: 0x000000,
    });
    const geometry = new EdgesGeometry(this.geometry);
    this.selection = new LineSegments(geometry, material);
    this.selection.visible = false;
    this.scene.add(this.selection);
  }

  setupControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.orbitControls.screenSpacePanning = true;
    this.orbitControls.enableKeys = false;

    this.orbitControls.minDistance = 2;
    this.orbitControls.maxDistance = 100;

    this.orbitControls.maxPolarAngle = Math.PI;

    this.orbitControls.addEventListener('change', () => {
      this.selection.visible = false;
    });

    this.orbitControls.addEventListener('start', () => {
      this.orbitControlsStarted = true;
    });
    this.orbitControls.addEventListener('end', () => {
      this.orbitControlsStarted = false;
    });
  }

  windowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  windowKeyDown(event: KeyboardEvent) {
    if (!this.orbitControls.enabled || this.orbitControlsStarted) return;

    if (event.key === 'Shift') this.orbitControls.enabled = false;
    this.selection.visible = false;
  }

  windowKeyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') this.orbitControls.enabled = true;
  }

  handleRecolor(event: MouseEvent) {
    this.selection.visible = false;
    const closest = this.getClosest(this.getMousePos(event))?.object as Mesh;
    if (!closest) return;

    (closest.material as MeshBasicMaterial).color = new Color(this.color);
  }

  windowMouseMove(event: MouseEvent) {
    event.preventDefault();

    if (event.buttons === 1 && event.shiftKey) {
      this.handleRecolor(event);
      return;
    }

    if (event.buttons === 1 || event.shiftKey) {
      return;
    }

    const closest = this.getClosest(this.getMousePos(event));

    if (!closest) {
      this.selection.visible = false;
      return;
    }

    this.selection.position.addVectors(
      closest.object.position,
      closest.face.normal
    );
    this.selection.visible = true;
  }

  windowClick(event: MouseEvent) {
    event.preventDefault();

    if (event.shiftKey) {
      this.handleRecolor(event);
    }

    if (!this.selection.visible) return;

    this.addBox(this.selection.position);
    setTimeout(() => this.windowMouseMove(event), 0);
  }

  windowRightClick(event: MouseEvent) {
    event.preventDefault();

    if (!this.selection.visible) return;
    const closest = this.getClosest(this.getMousePos(event));
    if (!closest) return;

    // Do not remove base cube
    if (closest.object.position.length() === 0) {
      this.label.show(
        event.clientX,
        event.clientY,
        "You can't remove the center cube."
      );
      return;
    }
    this.scene.remove(closest.object);
    setTimeout(() => this.windowMouseMove(event), 0);
  }

  animate() {
    window.requestAnimationFrame(() => this.animate());
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  }

  ngAfterViewInit(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.setupControls();
    this.animate();
  }
}
