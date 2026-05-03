'use client';

import Image from "next/image";
import { TurnTableMediaCard } from '@/app/components/card/TurnTableMediaCard'
import React, { useState } from 'react';


type SearchTabType = 'Gloss' | 'Salon' | 'Media';

const dummyMedia = {

  source: [

    { type: "image", url: "https://picsum.photos/200/300" },

    { type: "image", url: "https://picsum.photos/200/300" },

    { type: "video", url: "https://example.com/video1.mp4" },

  ],

  type: "fanArt" as const,

};


export default function Home() {
  const [selectedTab, setSelectedTab] = useState< SearchTabType>('Gloss');

  return (
    <div className="night">
      <TurnTableMediaCard
        cover={{
          src:"https://picsum.photos/200/300",
          alt: ""
        }}
        songName="SongName"
        artistName="ArtistName"
        hasSeeAlso={true}
        onSeeAlso={() => {}}
        primaryService="youtube"
        service={{
          onYoutube() {
            () => {}
          },
          onSpotify() {
          () => {}
          },
          onAppleMusic() {
            () => {}
          }
        }}
        onMute={() =>{}}
        onPause={() => {}}
        isMuted={true}
        isPaused={true}
        progress={30}
        />

      {/* <Gloss
        glossContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.https://www.youtube.com/"
        isInFeed={false}
        isInRoom={true}
        isInSalon={false}
        roomName="Room"
        salonName="Salon"
        userName="User"
        user={{
          iconUrl:"https://picsum.photos/200/300"
        }}
        room={{
          iconUrl:"https://picsum.photos/200/300"
        }}
        postedAt="2026-05-01T17:30:00Z"
        media={dummyMedia}
        mediaEmbed={{
          url: "https://youtu.be/gx1cGm5XJUk?si=F43BRMgrXDFRrlkv"
        }}
        action={{

          onRoom: () => {},

          onFond: () => {},

          onReply: () => {},

          onMenu: () => {},

        }}
        fond={{
          value: 0,
          isPressed: false
        }}
        lang="en"
        reply={{
          count: 10000
        }}
        topic={{
          topicContent: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.youtube.com",
          mediaSource: [

            { type: "image", url: "https://picsum.photos/200/300" },

            { type: "image", url: "https://picsum.photos/200/300" },

            { type: "video", url: "https://example.com/video1.mp4" },

          ],
          mediaType: "official",
          mediaEmbedUrl: "https://youtu.be/gx1cGm5XJUk?si=F43BRMgrXDFRrlkv",
          onTopicSeeAlso: () => {}
        }}
        notification={{type:"divided"}}
        revaluation={{
          onYes: () => {},
          onNo: () => {}
        }}
      /> */}
      </div>
  );
}
