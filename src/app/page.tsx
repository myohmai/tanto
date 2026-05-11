'use client';

import Image from "next/image";
import { CreateSalon } from '@/app/components/room/SalonSettings';
import { EditIconButton } from '@/app/components/buttons/EditIconButton'
import React, { useState } from 'react';

import type { RoomData } from "@/app/types/room";




const initialSource: MediaItem[] = [
  { type: "image", url: "https://picsum.photos/200" },
  { type: "image", url: "https://picsum.photos/400" },
  { type: "video", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" }
];

const initialRoomData: RoomData = {
  roomName: "Room",
  roomInformation: "",
  tags: "",
  roomRule: "",
  roomMemberIni : {
    initialName: "USer",
    iconUrl: "",
  },
  roomHost : {
    userName: "Host",
    iconUrl: "",
    subIcon: undefined,
  },
  roomVisibility: "public",
  roomEntrySetting: undefined,
  roomQuiz: [],
  roomQuizScore: 0,
  roomKeyWord: "",
  roomKeyWordHint: "",
  hostCreateSalon: false,
}

import type { QuizeList } from "@/app/components/form/SetQuizes/SetQuizes";

export const dummyQuizes: QuizeList[] = [
    {
        id: "q1",
        question: "How often do you use TypeScript?",
        option: [
            {
                id: "q1o1",
                text: "Never",
                score: 0,
            },
            {
                id: "q1o2",
                text: "Sometimes",
                score: 1,
            },
            {
                id: "q1o3",
                text: "Often",
                score: 2,
            },
            {
                id: "q1o4",
                text: "Always",
                score: 3,
            },
        ],
    },
    {
        id: "q2",
        question: "How comfortable are you with React state management?",
        option: [
            {
                id: "q2o1",
                text: "Not comfortable",
                score: 0,
            },
            {
                id: "q2o2",
                text: "A little",
                score: 1,
            },
            {
                id: "q2o3",
                text: "Pretty comfortable",
                score: 2,
            },
            {
                id: "q2o4",
                text: "Very comfortable",
                score: 3,
            },
        ],
    },
];

const initialUser =  {
  userName: "user"
}

export default function Home() {
const [source, setSource] = useState<MediaItem[]>(initialSource);

const [user, setUser] = useState(initialUser);

  const handleRemove = (index: number) => {

    setSource((prev) => prev.filter((_, i) => i !== index));

  };
  return (
    <div className="night">
      
      <CreateSalon roomName="Room"/>

      </div>
  );
}
