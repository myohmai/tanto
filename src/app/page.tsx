'use client';

import Image from "next/image";
import { ReplyBar } from "@/app/components/buttons/ReplyBar";

export default function Home() {
  return (
    <div className="night">
      <ReplyBar userIconUrl="/images/avatar/default-user.png" onClick={() => {}} />
    </div>
  );
}
