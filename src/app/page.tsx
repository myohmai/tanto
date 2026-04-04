'use client';

import Image from "next/image";
import { Revaluation } from "@/app/components/evaluation/Revaluation";

export default function Home() {
  return (
    <Revaluation lang="en" onYes={() => {}} onNo={() => {}} />
  );
}
