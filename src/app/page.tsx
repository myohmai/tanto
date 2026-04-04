'use client';

import Image from "next/image";
import { CameraButton } from "@/app/components/buttons/CameraButton";

export default function Home() {
  return (
    <CameraButton onSelectFile={(file) => console.log('File selected:', file)} />
  );
}
