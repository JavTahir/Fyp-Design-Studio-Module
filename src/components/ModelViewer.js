// components/ModelViewer.js
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

function ShirtModel({ customizations }) {
  const { scene: baseModel } = useGLTF("/assets/models/shirt_base.glb");
  const [model, setModel] = useState(null);
  const [parts, setParts] = useState({});
  const { scene } = useThree();

  // Initialize model and auto-discover parts
  useEffect(() => {
    if (!baseModel) return;

    const clonedModel = baseModel.clone();
    const identifiedParts = {};
    const allParts = [];

    // Traverse model to find and log all meshes
    clonedModel.traverse((child) => {
      if (child.isMesh) {
        allParts.push(child.name);

        // Improved identification with flexible naming
        const lowerName = child.name.toLowerCase();

        if (/sleeve|arm/.test(lowerName)) {
          identifiedParts.sleeves = identifiedParts.sleeves || [];
          identifiedParts.sleeves.push(child);
        } else if (/collar|neck/.test(lowerName)) {
          identifiedParts.collar = child;
        } else if (/body|shirt|main/.test(lowerName)) {
          identifiedParts.body = child;
        }
        // Add more patterns as needed
      }
    });

    // Log discovered parts to console
    console.log("All mesh names in model:", allParts);
    console.log("Identified parts:", {
      sleeves: identifiedParts.sleeves?.map((s) => s.name),
      collar: identifiedParts.collar?.name,
      body: identifiedParts.body?.name,
    });

    setModel(clonedModel);
    setParts(identifiedParts);
    scene.add(clonedModel);

    return () => {
      scene.remove(clonedModel);
    };
  }, [baseModel, scene]);

  // Handle part swapping
  useEffect(() => {
    if (!model || !parts.sleeves || !parts.collar) return;

    const swapPart = async (partName, defaultPart) => {
      if (customizations[partName] === "default") {
        // Show default part
        if (Array.isArray(defaultPart)) {
          defaultPart.forEach((part) => (part.visible = true));
        } else {
          defaultPart.visible = true;
        }
        // Remove any custom part
        const prevCustom = model.getObjectByName(`custom_${partName}`);
        if (prevCustom) model.remove(prevCustom);
        return;
      }

      try {
        // Hide default part
        if (Array.isArray(defaultPart)) {
          defaultPart.forEach((part) => (part.visible = false));
        } else {
          defaultPart.visible = false;
        }

        // Load new part
        const { default: partModel } = await import(
          `../../assets/models/${partName}s/${customizations[partName]}.glb`
        );

        const newPart = partModel.scene.children[0].clone();
        newPart.name = `custom_${partName}`;

        // Position new part (handle arrays for multiple pieces like sleeves)
        if (Array.isArray(defaultPart)) {
          newPart.position.copy(defaultPart[0].position);
          newPart.rotation.copy(defaultPart[0].rotation);
        } else {
          newPart.position.copy(defaultPart.position);
          newPart.rotation.copy(defaultPart.rotation);
        }

        // Remove previous custom part if exists
        const prevCustom = model.getObjectByName(`custom_${partName}`);
        if (prevCustom) model.remove(prevCustom);

        model.add(newPart);
      } catch (error) {
        console.error(`Error loading ${partName}:`, error);
      }
    };

    swapPart("sleeve", parts.sleeves);
    swapPart("collar", parts.collar);
  }, [customizations, model, parts]);

  return null;
}

export default function ModelViewer({ customizations }) {
  return (
    <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ShirtModel customizations={customizations} />
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}
