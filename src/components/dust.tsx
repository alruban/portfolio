import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const dust: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // the second parameter is the alpha (transparency)

    if (mountRef.current) {
      renderer.domElement.classList.add("inset-0", "absolute", "!w-full", "!h-full", "pointer-events-none", "-z-1")
      mountRef.current.appendChild(renderer.domElement);
    }

    // Particle setup
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position particles to peak on the right and descend to the left
      posArray[i] = (Math.random() - 0.5) * (i % 3 === 0 ? 10 : 5);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.01,
      color: '#394c39',
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      particleSystem.geometry.attributes.position.array.forEach((value, index) => {
        const randX = (Math.random() - 0.5) * 0.1; // Random displacement for X
        const randY = (Math.random() - 0.5) * 0.1; // Random displacement for Y
        const randZ = (Math.random() - 0.5) * 0.1; // Random displacement for Z

        if(index % 3 === 0) { // x
          particleSystem.geometry.attributes.position.array[index] += randX;
        } else if(index % 3 === 1) { // y
          particleSystem.geometry.attributes.position.array[index] += randY;
        } else if(index % 3 === 2) { // z
          particleSystem.geometry.attributes.position.array[index] += randZ;
        }
      });

      // Since we've modified the positions, we need to inform Three.js that
      // the positions need to be updated on the GPU side as well.
      particleSystem.geometry.attributes.position.needsUpdate = true;

      particleSystem.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default dust;
