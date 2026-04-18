'use client';

import Image from "next/image";
import { TurnTableMediaTab } from '@/app/components/bar/TurnTableMediaTab'
import React, { useState } from 'react';

type TurnTableMediaType = 'Video' | 'Music';


export default function Home() {
  const [selectedTab, setSelectedTab] = useState<TurnTableMediaType>('Video');
  return (
    <div>
      <TurnTableMediaTab selectedTab={selectedTab} onChange={setSelectedTab}/>
    </div>
  );
}
