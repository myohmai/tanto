'use client';

import Image from "next/image";
import { SalonMenu } from '@/app/components/menu/SalonMenu'
import React, { useState } from 'react';


type SearchTabType = 'Gloss' | 'Salon' | 'Media';





export default function Home() {
  const [selectedTab, setSelectedTab] = useState< SearchTabType>('Gloss');

  return (
    <div className="night">
      <SalonMenu isHost={true} />
      </div>
  );
}
