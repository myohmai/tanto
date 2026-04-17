'use client';

import Image from "next/image";
import { MediaEmbed } from "@/app/components/media/MediaEmbed";

export default function Home() {
  return (
    <div >
      <MediaEmbed url="https://music.apple.com/us/album/invader/1878296126?i=1878296127&itscg=30200&itsct=music_box_link&ls=1&app=music&mttnsubad=1878296127"/>
    </div>
  );
}
