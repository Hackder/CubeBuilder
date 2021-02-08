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
  OrthographicCamera,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
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
  @Input() isTrackball: boolean = false;
  @Input()
  set isPerspective(value: boolean) {
    const target = this.setupCamera(value);
    this.setupControls(target);
    this._isPerspective = value;
  }
  get isPerspective(): boolean {
    return this._isPerspective;
  }

  private _isPerspective: boolean = false;

  renderer = new WebGLRenderer({ antialias: true });
  scene: Scene = null;
  camera: PerspectiveCamera | OrthographicCamera | null = null;
  orbitControls: OrbitControls;
  trackballControls: TrackballControls;
  currentControls: OrbitControls | TrackballControls;
  ControlsStarted: boolean = false;
  geometry = new BoxGeometry(1, 1, 1);
  selection: LineSegments;
  raycaster = new Raycaster();
  viewSize = 5;

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

  setupCamera(perspective: boolean): Vector3 {
    const aspect = window.innerWidth / window.innerHeight;
    let cam: PerspectiveCamera | OrthographicCamera;
    if (perspective) {
      cam = new PerspectiveCamera(75, aspect, 0.001, 1000);
    } else {
      cam = new OrthographicCamera(
        (-aspect * this.viewSize) / 2,
        (aspect * this.viewSize) / 2,
        this.viewSize / 2,
        -this.viewSize / 2,
        0,
        1000
      );
    }

    if (this.camera !== null) {
      cam.position.copy(this.camera.position);
      cam.rotation.copy(this.camera.rotation);

      this.camera = cam;

      return new Vector3(
        this.currentControls.target.x,
        this.currentControls.target.y,
        this.currentControls.target.z
      );
    }
    this.camera = cam;

    return new Vector3();
  }

  ngOnInit(): void {
    this.renderer.setClearColor('#e5e5e5');
    this.scene = new Scene();

    this.setupCamera(this.isPerspective);
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

  setupControls(target?: Vector3) {
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
      this.ControlsStarted = true;
    });
    this.orbitControls.addEventListener('end', () => {
      this.ControlsStarted = false;
    });

    this.trackballControls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.trackballControls.minDistance = 2;
    this.trackballControls.maxDistance = 100;
    this.trackballControls.rotateSpeed = 8;
    this.trackballControls.panSpeed = 2;
    this.trackballControls.staticMoving = true;
    this.trackballControls.enabled = false;

    this.trackballControls.addEventListener('change', () => {
      this.selection.visible = false;
    });
    this.trackballControls.addEventListener('start', () => {
      this.ControlsStarted = true;
    });
    this.trackballControls.addEventListener('end', () => {
      this.ControlsStarted = false;
    });

    if (this.isTrackball) {
      this.currentControls = this.trackballControls;
    } else {
      this.currentControls = this.orbitControls;
    }

    if (target) {
      this.currentControls.target = target;
    }
  }

  windowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = aspect;
    } else if (this.camera instanceof OrthographicCamera) {
      this.camera.left = (-aspect * this.viewSize) / 2;
      this.camera.right = (aspect * this.viewSize) / 2;
      this.camera.top = this.viewSize / 2;
      this.camera.bottom = -this.viewSize / 2;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.trackballControls.handleResize();
  }

  windowKeyDown(event: KeyboardEvent) {
    if (!this.currentControls.enabled || this.ControlsStarted) return;

    if (event.key === 'Shift') this.currentControls.enabled = false;
    this.selection.visible = false;
  }

  windowKeyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') this.currentControls.enabled = true;
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

    if (
      this.scene.children
        .filter((child) => child.name === 'box')
        .some((object) => object.position.equals(this.selection.position))
    )
      return;

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
    this.currentControls = this.isTrackball
      ? this.trackballControls
      : this.orbitControls;
    this.trackballControls.enabled = this.isTrackball;
    this.orbitControls.enabled = !this.isTrackball;
    if (!this.isTrackball) this.camera.up.set(0, 1, 0);

    window.requestAnimationFrame(() => this.animate());
    this.currentControls.update();
    this.renderer.render(this.scene, this.camera);
  }

  ngAfterViewInit(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.setupControls();
    this.animate();
  }
}
