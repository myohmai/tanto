'use client';

import Image from "next/image";
import { RoomMenuButton } from "@/app/components/buttons/RoomMenuButton";

export default function Home() {
  return (
    <RoomMenuButton onClick={() => console.log("Room menu button clicked")} />
  );
}
