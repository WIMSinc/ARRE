import { useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useThreeJS = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeThreeJS = useCallback((container: HTMLElement) => {
    // Create scene
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xf7f7f7);
    
    // Create camera
    const newCamera = new THREE.PerspectiveCamera(
      75, // Field of view
      container.clientWidth / container.clientHeight, // Aspect ratio
      0.1, // Near plane
      1000 // Far plane
    );
    
    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(container.clientWidth, container.clientHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    
    // Add renderer to container
    container.innerHTML = '';
    container.appendChild(newRenderer.domElement);
    
    // Create controls
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    
    // Set up animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      newControls.update();
      newRenderer.render(newScene, newCamera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!container) return;
      
      newCamera.aspect = container.clientWidth / container.clientHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Update state
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);
    setIsInitialized(true);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(newRenderer.domElement);
      newRenderer.dispose();
    };
  }, []);

  return {
    scene,
    camera,
    renderer,
    controls,
    isInitialized,
    initializeThreeJS
  };
};
