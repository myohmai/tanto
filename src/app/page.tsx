'use client';

import Image from "next/image";
import { TagInputChip } from "@/app/components/tag/TagInputChip";

export default function Home() {
  return (
    <TagInputChip label="Example Tag" onRemove={() => console.log('remove')} />
  );
}
