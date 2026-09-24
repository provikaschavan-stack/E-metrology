import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const nodePositions = [
  [0, 0.9, 0],
  [0.95, 0.25, 0.15],
  [0.6, -0.75, 0.25],
  [-0.6, -0.75, 0.25],
  [-0.95, 0.25, 0.15],
  [0, 0, 0.95],
  [0, 0, -0.95],
];

const createInfoLabel = (text, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = 520;
  canvas.height = 96;
  const context = canvas.getContext('2d');
  context.fillStyle = 'rgba(7, 32, 54, 0.82)';
  context.strokeStyle = color;
  context.lineWidth = 3;
  context.roundRect(2, 2, 516, 92, 18);
  context.fill();
  context.stroke();
  context.font = '700 27px monospace';
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 260, 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.86, depthWrite: false }),
  );
  sprite.scale.set(1.2, 0.22, 1);
  return sprite;
};

export default function MetrologyScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 5.3);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const structure = new THREE.Group();
    scene.add(structure);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.64, 2),
      new THREE.MeshBasicMaterial({
        color: 0x75d9ff,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      }),
    );
    structure.add(core);

    const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xb6edff, transparent: true, opacity: 0.68 }),
    );
    structure.add(coreGlow);

    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const nodeGlowMaterial = new THREE.MeshBasicMaterial({ color: 0x7de3ff });
    const nodes = [];

    nodePositions.forEach((position, index) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(index === 5 ? 0.1 : 0.075, 16, 16),
        index === 5 ? nodeGlowMaterial : nodeMaterial,
      );
      node.position.set(...position);
      structure.add(node);
      nodes.push(node);
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x62cbe8, transparent: true, opacity: 0.42 });
    const links = nodePositions.map((position) => {
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...position)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      structure.add(line);
      return line;
    });

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.008, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0x7de3ff, transparent: true, opacity: 0.5 }),
    );
    orbit.rotation.x = Math.PI / 2.4;
    structure.add(orbit);

    const orbitAccent = new THREE.Mesh(
      new THREE.TorusGeometry(1.48, 0.006, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.4 }),
    );
    orbitAccent.rotation.set(Math.PI / 3, 0.5, 0.2);
    structure.add(orbitAccent);

    const infoLabels = [
      { text: 'VERIFIED', color: '#7de3ff', position: [-1.65, 0.95, 0.1] },
      { text: 'INS-2026-00001', color: '#ffd166', position: [1.55, 0.72, 0.1] },
      { text: 'LM-CERT-2026-00001', color: '#7de3ff', position: [1.5, -0.7, 0.1] },
      { text: 'VALID 26 AUG 2027', color: '#7ee787', position: [-1.55, -0.9, 0.1] },
    ].map(({ text, color, position }) => {
      const label = createInfoLabel(text, color);
      label.position.set(...position);
      label.userData.baseY = position[1];
      structure.add(label);
      return label;
    });

    const pointer = { x: 0, y: 0 };
    const handlePointer = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.5;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.35;
    };
    window.addEventListener('pointermove', handlePointer, { passive: true });

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let animationFrame;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      structure.rotation.y += 0.0025;
      structure.rotation.x = Math.sin(elapsed * 0.45) * 0.08 + pointer.y;
      structure.position.x += (pointer.x - structure.position.x) * 0.025;
      coreGlow.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.08);
      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(elapsed * 1.8 + index) * 0.18);
      });
      orbit.rotation.z = elapsed * 0.16;
      orbitAccent.rotation.y = elapsed * -0.12;
      infoLabels.forEach((label, index) => {
        label.position.y = label.userData.baseY + Math.sin(elapsed * 0.8 + index) * 0.035;
      });
      links.forEach((link, index) => {
        link.material.opacity = 0.27 + (Math.sin(elapsed * 1.6 + index) + 1) * 0.1;
      });
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointer);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-y-0 right-0 z-0 h-full w-full opacity-35 sm:opacity-50 lg:w-[58%] lg:opacity-70 pointer-events-none"
    />
  );
}
