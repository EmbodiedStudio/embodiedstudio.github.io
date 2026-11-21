import * as THREE from './vendor/three.module.js';
import { buildHome } from './room.js';
import { setupStudy } from './study.js';
import { tr } from './locale.js';

const canvas = document.getElementById('lab-view');
const panel = document.getElementById('paper-page');
const roomScreen = document.getElementById('room-screen');
const video = panel.querySelector('video');
const themeToggles = [...document.querySelectorAll('[data-theme-toggle]')];
const themeMeta = document.querySelector('meta[name="theme-color"]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sectionHashes = new Set(['#paper-title', '#abstract', '#method', '#gallery', '#execution', '#results']);
const THEME_KEY = 'embodiedstudio.homepage.night';

let cameraControl = null;
let flying = false;
let isNight = false;

try {
  isNight = localStorage.getItem(THEME_KEY) === '1';
} catch {
  isNight = false;
}

const linkedLighting = new URL(location.href).searchParams.get('lighting');
if (linkedLighting === 'night' || linkedLighting === 'day') isNight = linkedLighting === 'night';

const previewUrl = () => isNight
  ? tr('./media/study/screen-night-zh.webp', './media/study/screen-night-en.webp')
  : tr('./media/paper-screen.webp', './media/paper-screen-en.webp');

function applyTheme(nextNight, persist = true) {
  isNight = Boolean(nextNight);
  document.body.classList.toggle('is-night', isNight);
  document.documentElement.style.colorScheme = isNight ? 'dark' : 'light';
  if (themeMeta) themeMeta.setAttribute('content', isNight ? '#111110' : '#f5f3ec');
  for (const btn of themeToggles) {
    btn.setAttribute('aria-pressed', String(isNight));
    btn.setAttribute('aria-label', isNight ? tr('切换到日间模式', 'Switch to daylight mode') : tr('切换到暖夜模式', 'Switch to warm night mode'));
    const label = btn.querySelector('.theme-label');
    if (label) label.textContent = isNight ? tr('日间', 'Day') : tr('暖夜', 'Night');
  }
  cameraControl?.setNight(isNight);
  cameraControl?.setPreview(previewUrl());
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, isNight ? '1' : '0');
      const url = new URL(location.href);
      url.searchParams.set('lighting', isNight ? 'night' : 'day');
      history.replaceState(null, '', url);
    } catch {}
  }
}

for (const btn of themeToggles) {
  btn.addEventListener('click', () => applyTheme(!isNight));
}
applyTheme(isNight, false);

setupStudy();
window.addEventListener('paper-language-change', () => {
  applyTheme(isNight, false);
});

// Active section scroll-spy for sticky navigation
const navLinks = [...document.querySelectorAll('.paper-nav nav a[href^="#"]')];
const observedSections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const spy = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const activeHref = `#${visible.target.id}`;
      for (const link of navLinks) {
        const current = link.getAttribute('href') === activeHref;
        link.classList.toggle('is-active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    },
    { rootMargin: '-22% 0px -56% 0px', threshold: [0.05, 0.25, 0.5] }
  );
  for (const section of observedSections) spy.observe(section);
}

function updateLocation(page) {
  try {
    const url = new URL(location.href);
    if (page) url.searchParams.set('view', 'paper');
    else {
      url.searchParams.delete('view');
      url.hash = '';
    }
    history.replaceState(null, '', url.href);
  } catch {
    /* A local browser can restrict the address bar without affecting navigation. */
  }
}

function presentPaper(replaceUrl = true, focusTitle = false) {
  document.body.classList.add('paper-active');
  document.body.classList.remove('flying', 'handoff');
  panel.style.removeProperty('opacity');
  panel.inert = false;
  panel.removeAttribute('aria-hidden');
  roomScreen.inert = true;
  roomScreen.setAttribute('aria-hidden', 'true');
  flying = false;
  cameraControl?.setHover(false);
  cameraControl?.setActive(false);
  if (replaceUrl) updateLocation(true);
  if (focusTitle) {
    const heading = document.getElementById('paper-title');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}

function openPaper() {
  if (flying || document.body.classList.contains('paper-active')) return;
  if (!cameraControl || reducedMotion.matches) {
    presentPaper(true, true);
    return;
  }
  flying = true;
  document.body.classList.add('flying');
  cameraControl.setHover(false);
  cameraControl.approach(
    progress => {
      if (progress < .78) return;
      document.body.classList.add('handoff');
      const fade = Math.min(1, (progress - .78) / .22);
      panel.style.opacity = String(fade * fade * (3 - 2 * fade));
    },
    () => presentPaper(true, true)
  );
}

function returnToRoom() {
  video?.pause();
  window.scrollTo(0, 0);
  panel.inert = true;
  panel.setAttribute('aria-hidden', 'true');
  roomScreen.inert = false;
  roomScreen.removeAttribute('aria-hidden');
  document.body.classList.remove('paper-active');
  updateLocation(false);
  if (!cameraControl) {
    initRoom();
    return;
  }
  cameraControl.setActive(true);
  if (reducedMotion.matches) {
    cameraControl.reset();
    return;
  }
  flying = true;
  cameraControl.retreat(() => {
    flying = false;
  });
}

document.getElementById('return-room').addEventListener('click', returnToRoom);
window.addEventListener('hashchange', () => {
  if (!document.body.classList.contains('paper-active') && sectionHashes.has(location.hash)) presentPaper();
});
window.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || (event.key === ' ' && document.activeElement === canvas)) && !document.body.classList.contains('paper-active') && !flying) {
    const tag = document.activeElement?.tagName;
    if (tag !== 'BUTTON' && tag !== 'A') { event.preventDefault(); openPaper(); }
  }
});

function initRoom() {
  if (cameraControl) return;
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const camera = new THREE.PerspectiveCamera(45, 1, .025, 24);
    const deskShot = new THREE.PerspectiveCamera();
    let queuedDraw = 0;
    const { scene, monitorSurface, screenWidth, screenHeight, center, normal, setPreview, setHover, setNight } =
      buildHome(previewUrl(), () => {
        renderer.shadowMap.needsUpdate = true;
        if (!queuedDraw) queuedDraw=requestAnimationFrame(() => {
          queuedDraw=0;
          if (roomVisible) draw();
        });
      });
    const entryOrientation = new THREE.Quaternion();
    const motion = new THREE.Euler(0, 0, 0, 'YXZ');
    const ray = new THREE.Raycaster();
    let pointer = null, yaw = 0, pitch = 0, animation = 0, hoveringScreen = false, roomVisible = true;

    function draw() {
      renderer.render(scene, camera);
    }
    function entrance() {
      const portrait = camera.aspect < .82;
      deskShot.position.set(portrait ? -.39 : .42, portrait ? 1.51 : 1.62, portrait ? 2.14 : 1.83);
      deskShot.lookAt(portrait ? -.97 : -.64, portrait ? 1.22 : 1.17, -.46);
      return { position: deskShot.position.clone(), orientation: deskShot.quaternion.clone() };
    }
    function fitMonitor() {
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov * .5));
      const distance = Math.min(screenHeight / (2 * halfHeight), screenWidth / (2 * halfHeight * camera.aspect)) * .985;
      deskShot.position.copy(center).addScaledVector(normal, distance);
      deskShot.lookAt(center);
      return { position: deskShot.position.clone(), orientation: deskShot.quaternion.clone() };
    }
    function lookAround(dx, dy) {
      yaw = Math.max(-.34, Math.min(.34, yaw - dx * .0028));
      pitch = Math.max(-.17, Math.min(.20, pitch - dy * .0028));
      camera.quaternion.copy(entryOrientation).multiply(new THREE.Quaternion().setFromEuler(motion.set(pitch, yaw, 0)));
      draw();
    }
    function reset() {
      const { position, orientation } = entrance();
      yaw = 0;
      pitch = 0;
      camera.position.copy(position);
      camera.quaternion.copy(orientation);
      entryOrientation.copy(orientation);
      draw();
    }
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.fov = camera.aspect < .82 ? 57 : 45;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (!flying && !yaw && !pitch && !document.body.classList.contains('paper-active')) reset();
      else draw();
    }
    function move(pose, duration, onProgress, onComplete) {
      cancelAnimationFrame(animation);
      const start = camera.position.clone(), rotation = camera.quaternion.clone();
      const begin = performance.now();
      function frame(time) {
        const fraction = Math.min(1, (time - begin) / duration);
        const eased = fraction < .5
          ? 4 * fraction * fraction * fraction
          : 1 - Math.pow(-2 * fraction + 2, 3) / 2;
        camera.position.copy(start).lerp(pose.position, eased);
        camera.quaternion.copy(rotation).slerp(pose.orientation, eased);
        draw();
        onProgress(fraction);
        if (fraction < 1) animation = requestAnimationFrame(frame);
        else {
          animation = 0;
          onComplete();
        }
      }
      animation = requestAnimationFrame(frame);
    }

    function setActive(active) {
      roomVisible = active;
      if (active) draw();
    }

    function monitorHit(event) {
      const box = canvas.getBoundingClientRect();
      ray.setFromCamera(
        new THREE.Vector2((event.clientX - box.left) * 2 / box.width - 1, 1 - (event.clientY - box.top) * 2 / box.height),
        camera
      );
      return ray.intersectObject(monitorSurface, false).length > 0;
    }
    function updateHover(hit) {
      if (hit === hoveringScreen) return;
      hoveringScreen = hit;
      canvas.toggleAttribute('data-target', hit);
      setHover(hit);

    }


    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0 || flying) return;
      pointer = { id: event.pointerId, sx: event.clientX, sy: event.clientY, x: event.clientX, y: event.clientY, moved: false };
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', event => {
      if (flying) return;
      if (pointer?.id !== event.pointerId) {
        updateHover(monitorHit(event));
        return;
      }
      if (!pointer.moved && Math.hypot(event.clientX - pointer.sx, event.clientY - pointer.sy) < 5) return;
      pointer.moved = true;
      canvas.dataset.drag = '';
      updateHover(false);
      lookAround(event.clientX - pointer.x, event.clientY - pointer.y);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    });
    function clearPointer() {
      pointer = null;
      delete canvas.dataset.drag;
    }
    canvas.addEventListener('pointerup', event => {
      if (pointer?.id !== event.pointerId) return;
      const clicked = !pointer.moved && monitorHit(event);
      clearPointer();
      if (clicked) openPaper();
    });
    canvas.addEventListener('pointercancel', clearPointer);
    canvas.addEventListener('pointerleave', () => updateHover(false));

    cameraControl = {
      reset,
      setPreview,
      setHover,
      setNight,
      setActive,
      approach: (progress, done) => move(fitMonitor(), 1020, progress, done),
      retreat: done => {
        const entry = entrance();
        entryOrientation.copy(entry.orientation);
        yaw = 0;
        pitch = 0;
        move(entry, 700, () => {}, done);
      }
    };
    setNight(isNight);
    resize();
    new ResizeObserver(resize).observe(canvas);
  } catch (error) {
    console.error('Could not open the study', error);
    presentPaper(true, true);
  }
}

if (new URLSearchParams(location.search).get('view') === 'paper' || sectionHashes.has(location.hash)) {
  presentPaper(false);
  if (sectionHashes.has(location.hash)) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
} else {
  initRoom();
}
