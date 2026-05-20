"use client";
import { SideNavBar } from "@/app/components/bar/SideNavBar";
import { BottomNavBar } from "@/app/components/bar/BottomNavBar";
import type { UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { getCurrentUserId } from "@/repositories/currentUser";
import { getUserRoomsByUser } from "@/repositories/userRoom";

import 'destyle.css'
import './layout.scss';
import "@/app/styles/globals.scss";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

type SideBarType =
  | "Home"
  | "Hallway"
  | "Mood"
  | "Search"
  | "Message"
  | "Dashboard"
  | "Fond"
  | "Bookmark"
  | "Settings";

type BottomNavType = "Home" | "Hallway" | "Mood" | "Message" | "Dashboard";

type CurrentRoom = {
  roomId: string;
  iconUrl?: string;
  subIcon?: UserSubIcon;
};

type LayoutMode = "expanded" | "compact" | "mobile";

export default function ResponsiveShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("expanded");
  const [selected, setSelected] = useState<SideBarType>("Home");
  const [bottomSelected, setBottomSelected] = useState<BottomNavType>("Home");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRooms, setUserRooms] = useState<CurrentRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<CurrentRoom | undefined>(undefined);

  useEffect(() => {
  const load = async () => {
    const uid = await getCurrentUserId();
    const userRooms = await getUserRoomsByUser(uid);

    setCurrentUserId(uid);

    setUserRooms(
      userRooms.map((userRoom) => ({
        roomId: userRoom.roomId,
        iconUrl: userRoom.iconUrl ?? undefined,
        subIcon: userRoom.subIcon ?? undefined,
      }))
    );

    const profileRoom = userRooms.find(
      (userRoom) => userRoom.userId === uid
    );

    if (profileRoom) {
      setCurrentRoom({
        roomId: profileRoom.roomId,
        iconUrl: profileRoom.iconUrl ?? undefined,
        subIcon: profileRoom.subIcon ?? undefined,
      });
    }
  };

  load();
}, []);
  useEffect(() => {
    const updateMode = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setLayoutMode("expanded");
      } else if (width >= 800) {
        setLayoutMode("compact");
      } else {
        setLayoutMode("mobile");
      }
    };

    updateMode();
    window.addEventListener("resize", updateMode);
    return () => window.removeEventListener("resize", updateMode);
  }, []);

  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/" || pathname === "/feed") {
      setSelected("Home");
      setBottomSelected("Home");
    } else if (pathname.startsWith("/hallway")) {
      setSelected("Hallway");
      setBottomSelected("Hallway");
    } else if (pathname.startsWith("/mood")) {
      setSelected("Mood");
      setBottomSelected("Mood");
    } else if (pathname.startsWith("/dashboard")) {
      setSelected("Dashboard");
      setBottomSelected("Dashboard");
    }

    const roomMatch = pathname.match(/^\/room\/([^/]+)/);
    if (roomMatch) {
      const roomId = roomMatch[1];
      const matchedRoom = userRooms.find(
        (room) => room.roomId === roomId
      );
      if (matchedRoom) {
        setCurrentRoom(matchedRoom);
      }
    }
  }, [pathname, userRooms]);

  const navigateTo = (value: SideBarType | BottomNavType) => {
    switch (value) {
      case "Home":
        router.push("/feed");
        break;
      case "Hallway":
        router.push("/hallway");
        break;
      case "Mood":
        router.push("/mood");
        break;
      case "Dashboard":
        router.push("/dashboard");
        break;
      default:
        break;
    }
  };

  const layoutClassName = `layout layout--${layoutMode}`;

  return (
    <html lang="ja">
      <body>
        <div className={layoutClassName}>
          {(layoutMode === "expanded" || layoutMode === "compact") && (
            <div className="layout__side-nav-wrapper">
              <SideNavBar
                selected={selected}
                onChange={(value) => {
                  setSelected(value);
                  navigateTo(value);
                }}
                onLogOut={() => {
                  console.log("logout");
                }}
              />
            </div>
          )}
          <main className="layout__main">
            {children}
          </main>
          {layoutMode === "mobile" && (
            <BottomNavBar
                bottomSelectTab={bottomSelected}
                onChange={(value) => {
                  setBottomSelected(value);
                  navigateTo(value);
                }}
                currentRoom={currentRoom}
              />
            )}
          {(layoutMode === "expanded" || layoutMode === "compact") && <div className="layout__side-space" />}
        </div>
      </body>
    </html>
  );
}