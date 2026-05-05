'use client';

import Image from "next/image";
import { PasswordArea } from '@/app/components/form/PasswordArea';
import { EditIconButton } from '@/app/components/buttons/EditIconButton'
import React, { useState } from 'react';






export default function Home() {
const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      
      <PasswordArea
        label="Password"
        isVisible={true}
        error="error"
      />
      </div>
  );
}
