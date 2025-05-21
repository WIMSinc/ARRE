import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useThreeJS } from '@/hooks/use-threejs';

interface ThreeJSModelViewerProps {
  modelId?: number; // Optional model ID to load a specific model
  className?: string;
}

const ThreeJSModelViewer = ({ modelId, className = "w-full h-80" }: ThreeJSModelViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scene, camera, renderer, controls, isInitialized, initializeThreeJS } = useThreeJS();

  useEffect(() => {
    if (containerRef.current && !isInitialized) {
      initializeThreeJS(containerRef.current);
      
      // Setup basic scene with a building
      setupBasicScene();
    }
    
    // Cleanup on unmount
    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [containerRef, isInitialized, initializeThreeJS]);

  const setupBasicScene = () => {
    if (!scene || !camera) return;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Create a simple building (box)
    const buildingGeometry = new THREE.BoxGeometry(2, 4, 2);
    const buildingMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0055a4,  // Primary blue color
      flatShading: true,
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = 2; // Raise it to sit on the ground
    scene.add(building);
    
    // Add windows (small white boxes) to the building
    const windowGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const windowMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    
    // Front face windows
    for (let y = 0.5; y < 3.5; y += 0.6) {
      for (let x = -0.6; x <= 0.6; x += 0.6) {
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(x, y, 1.01);
        scene.add(windowMesh);
      }
    }
    
    // Left face windows
    for (let y = 0.5; y < 3.5; y += 0.6) {
      for (let z = -0.6; z <= 0.6; z += 0.6) {
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.rotation.y = Math.PI / 2;
        windowMesh.position.set(-1.01, y, z);
        scene.add(windowMesh);
      }
    }
    
    // Right face windows
    for (let y = 0.5; y < 3.5; y += 0.6) {
      for (let z = -0.6; z <= 0.6; z += 0.6) {
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.rotation.y = Math.PI / 2;
        windowMesh.position.set(1.01, y, z);
        scene.add(windowMesh);
      }
    }
    
    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xeeeeee,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);
    
    // Add some decorative elements
    // Trees
    const treeGeometry = new THREE.ConeGeometry(0.4, 1, 8);
    const treeMaterial = new THREE.MeshPhongMaterial({ color: 0x2e8b57 });
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    
    const createTree = (x: number, z: number) => {
      const tree = new THREE.Mesh(treeGeometry, treeMaterial);
      tree.position.set(x, 0.75, z);
      scene.add(tree);
      
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, 0.25, z);
      scene.add(trunk);
    };
    
    createTree(3, 3);
    createTree(-3, -3);
    createTree(3, -3);
    createTree(-3, 3);
    
    // Position camera
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  };

  return (
    <div 
      ref={containerRef}
      className={`three-d-placeholder ${className}`}
      aria-label="3D Model Viewer"
    ></div>
  );
};

export default ThreeJSModelViewer;
