'use client';

import Image from "next/image";
import { SearchTabBar } from '@/app/components/bar/SearchTabBar'
import React, { useState } from 'react';


type SearchTabType = 'Gloss' | 'Salon' | 'Media';





export default function Home() {
  const [selectedTab, setSelectedTab] = useState< SearchTabType>('Gloss');

  return (
    <div>
            <SearchTabBar selectedTab={selectedTab} onChange={setSelectedTab} />
    </div>
  );
}
