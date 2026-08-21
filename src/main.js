import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import './styles.css';

import { createParameters } from './simulation/parameters.js';
import { createSimulation } from './simulation/createSimulation.js';
import { createLabPanel } from './ui/labPanel.js';



/*
2^15: 32768
2^16: 65536
2^17: 131072
2^18: 262144
2^19: 524288
2^20: 1048576
2^21: 2097152
2^22: 4194304
2^23: 8388608
2^24: 16777216
*/

const PARTICLE_COUNT = 131072; //2^17. Increase only after measuring performance.

async function main() {
  const mount = document.querySelector('#app');

  if (!WebGPU.isAvailable()) {
    mount.appendChild(WebGPU.getErrorMessage());
    throw new Error('Este proyecto requiere WebGPU para ejecutar compute shaders.');
  }

  // THREE.JS MENTAL MODEL: scene + camera + renderer ---------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#050607');

  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.05, 100);
  camera.position.set(0, 0, 11);

  const renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  mount.appendChild(renderer.domElement);
  await renderer.init();

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.target.set(0, 0, 0);

  const params = createParameters();
  const simulation = createSimulation({ renderer, scene, params, count: PARTICLE_COUNT });

  // LAB HELPERS -----------------------------------------------------------
  const attractorHelper = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  scene.add(attractorHelper);
  const axes = new THREE.AxesHelper(1.5);
  scene.add(axes);

  // POINTER -> WORLD POSITION --------------------------------------------
  // This is a useful camera concept: screen coordinates are not world coords.
  const pointerNdc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  addEventListener('pointermove', (event) => {
    pointerNdc.x = (event.clientX / innerWidth) * 2 - 1;
    pointerNdc.y = -(event.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    if (raycaster.ray.intersectPlane(interactionPlane, hit)) {
      params.attractor.value.copy(hit);
      attractorHelper.position.copy(hit);
    }
  });

  let paused = false;
  let mode = 'LAB';
  let panel;
  let savedRadialStrength = params.radialStrength.value;
  let savedRadialEnabled = params.radialEnabled.value;

  const applyPreset = (id) => {
    params.windEnabled.value = 0;
    params.radialEnabled.value = 0;
    params.vortexEnabled.value = 0;
    params.dragEnabled.value = 0;
    params.wind.value.set(0, 0, 0);
    params.initialSpeed.value = 0;

    if (id === 'inertia') {
      params.initialSpeed.value = 0.8;
    } else if (id === 'wind') {
      params.windEnabled.value = 1;
      params.wind.value.set(1.5, 0, 0);
    } else if (id === 'attract') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = 3.0;
    } else if (id === 'repel') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = -3.0;
    } else if (id === 'vortex') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = 1.0;
      params.vortexEnabled.value = 1;
      params.vortexStrength.value = 3.0;
      params.dragEnabled.value = 1;
      params.dragCoefficient.value = 0.08;
    }
    simulation.reset();
    panel?.refresh();
  };

  const setMode = (next) => {
    mode = next;
    const lab = mode === 'LAB';
    panel.setVisible(lab);
    axes.visible = lab;
    attractorHelper.visible = lab;
    //orbit.enabled = lab;
    hud.innerHTML = lab
      ? '<strong>LAB</strong> · P: performance · R: reset · 1: radial · 2: viento · 3: vórtice+drag · espacio: invertir radial · num +/-: timeScale · num */÷: drag · num 8/2: radialStrength · num 0: drag on/off'
      : '<strong>PERFORMANCE</strong> · P: lab · R: reset · 1: radial · 2: viento · 3: vórtice+drag · espacio: invertir radial · puntero: atractor · num +/-: timeScale · num */÷: drag · num 8/2: radialStrength · num 0: drag on/off';
  };

  panel = createLabPanel({
    params,
    onReset: () => simulation.reset(),
    onPreset: applyPreset,
    onModeChange: () => setMode(mode === 'LAB' ? 'PERFORMANCE' : 'LAB'),
    onPauseChange: () => paused = !paused
  });

  const hud = document.createElement('div');
  hud.className = 'hud';
  document.body.append(hud);
  setMode('LAB');

  // BASELINE LIVE INSTRUMENT MAPPING -------------------------------------
  // Students are expected to redesign this mapping for their own instrument.
  addEventListener('keydown', (event) => {
    //console.log('radial inverted', params.radialStrength.value);
    if (event.repeat) return;
    if (event.code === 'KeyP') setMode(mode === 'LAB' ? 'PERFORMANCE' : 'LAB');
    if (event.code === 'KeyR') simulation.reset();

    // LIVE INSTRUMENT KEYS — toggle each force on/off in place, no reset,
    // so they stay independently composable while the system keeps reacting
    // from wherever it already is. Ficha de fuerzas: radial = central duality,
    // viento = flowing section, vórtice+drag = circulating section (paired key).
    if (event.code === 'Digit1') {
      params.radialEnabled.value = params.radialEnabled.value > 0 ? 0 : 1;
      panel?.refresh();
    }
    if (event.code === 'Digit2') {
      const on = params.windEnabled.value > 0 ? 0 : 1;
      params.windEnabled.value = on;
      // wind.x defaults to 0 — enabling the flag alone does nothing without
      // a magnitude. Ficha de fuerzas only uses wind in one fixed direction
      // (+X, "río"), so the toggle sets it directly instead of adding more keys.
      if (on) params.wind.value.x = 1.5;
      panel?.refresh();
    }
    if (event.code === 'Digit3') {
      const on = params.vortexEnabled.value > 0 ? 0 : 1;
      params.vortexEnabled.value = on;
      params.dragEnabled.value = on;
      panel?.refresh();
    }

    // NUMPAD — continuous parameter nudges + independent drag toggle.
    // Separate event.code namespace from Digit1-9, so no collision with
    // the force-toggle keys above even on a full keyboard.
    if (event.code === 'NumpadAdd') {
      params.timeScale.value = Math.min(2, params.timeScale.value + 0.1);
      panel?.refresh();
    }
    if (event.code === 'NumpadSubtract') {
      params.timeScale.value = Math.max(0, params.timeScale.value - 0.1);
      panel?.refresh();
    }
    if (event.code === 'NumpadMultiply') {
      params.dragCoefficient.value = Math.min(1, params.dragCoefficient.value + 0.02);
      panel?.refresh();
    }
    if (event.code === 'NumpadDivide') {
      params.dragCoefficient.value = Math.max(0, params.dragCoefficient.value - 0.02);
      panel?.refresh();
    }
    if (event.code === 'Numpad8') {
      params.radialStrength.value = Math.min(8, params.radialStrength.value + 0.3);
      panel?.refresh();
    }
    if (event.code === 'Numpad2') {
      params.radialStrength.value = Math.max(-8, params.radialStrength.value - 0.3);
      panel?.refresh();
    }
    if (event.code === 'Numpad0') {
      params.dragEnabled.value = params.dragEnabled.value > 0 ? 0 : 1;
      panel?.refresh();
    }

    if (event.code === 'Space') {
      event.preventDefault();
      //savedRadialStrength = params.radialStrength.value || 2.0;
      savedRadialStrength = params.radialStrength.value;
      savedRadialEnabled = params.radialEnabled.value;
      params.radialEnabled.value = 1;
      params.radialStrength.value = -(savedRadialStrength || 2.0);
      //console.log('radial inverted', params.radialStrength.value);
    }
  });

  addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      params.radialEnabled.value = savedRadialEnabled;
      params.radialStrength.value = savedRadialStrength;
    }
  });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  simulation.reset();

  // FRAME LOOP ------------------------------------------------------------
  renderer.setAnimationLoop(() => {
    if (!paused) simulation.stepSimulation();
    orbit.update();
    renderer.render(scene, camera);
  });
}

main().catch((error) => {
  console.error(error);
  const pre = document.createElement('pre');
  pre.style.cssText = 'position:fixed;inset:16px;white-space:pre-wrap;color:#fff;z-index:50';
  pre.textContent = String(error?.stack || error);
  document.body.append(pre);
});
