'use client';

import Image from "next/image";
import { TabButton } from "@/app/components/buttons/TabButton";

export default function Home() {
  return (
    <div >
      <TabButton label="label" isSelected={false}/>
    </div>
  );
}
