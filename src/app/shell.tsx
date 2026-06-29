"use client";

import { SideNavBar } from "@/app/components/bar/SideNavBar";
import { BottomNavBar } from "@/app/components/bar/BottomNavBar";
import type { UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { supabase } from "@/lib/supabase";
import { getCurrentUserIdOrNull } from "@/repositories/currentUser";
import { getUserRoomsByUser } from "@/repositories/userRoom";
import { SideMenuContext } from "@/app/context/SideMenuContext";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

type SideBarType =
  | "Home"
  | "Hallway"
  | "Mood"
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

export function ResponsiveShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("expanded");
  const [selected, setSelected] = useState<SideBarType>("Home");
  const [bottomSelected, setBottomSelected] = useState<BottomNavType>("Home");
  const [, setCurrentUserId] = useState<string | null>(null);
  const [userRooms, setUserRooms] = useState<CurrentRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<CurrentRoom | undefined>(undefined);
  const [isMobileSideMenuOpen, setIsMobileSideMenuOpen] = useState(false);

  const openSideMenu = useCallback(() => setIsMobileSideMenuOpen(true), []);

  useEffect(() => {
    const load = async () => {
      const PUBLIC_PATHS = ["/auth", "/privacy"];
      const isPublicPage = PUBLIC_PATHS.some(p => pathname?.startsWith(p));

      const uid = await getCurrentUserIdOrNull();
      if (!uid) {
        if (!isPublicPage) router.push("/auth");
        return;
      }

      const userRooms = await getUserRoomsByUser(uid);
      setCurrentUserId(uid);

      if (userRooms.length === 0 && !pathname?.startsWith("/onboarding") && !pathname?.startsWith("/admin")) {
        router.push("/onboarding");
        return;
      }

      setUserRooms(
        userRooms.map((userRoom) => ({
          roomId: userRoom.roomId,
          iconUrl: userRoom.iconUrl ?? undefined,
          subIcon: userRoom.subIcon ?? undefined,
        }))
      );

      const profileRoom = userRooms.find((userRoom) => userRoom.userId === uid);
      if (profileRoom) {
        setCurrentRoom({
          roomId: profileRoom.roomId,
          iconUrl: profileRoom.iconUrl ?? undefined,
          subIcon: profileRoom.subIcon ?? undefined,
        });
      }
    };

    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.push("/auth");
      if (event === "SIGNED_IN") load();
    });

    return () => subscription.unsubscribe();
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
    } else if (pathname.startsWith("/fond")) {
      setSelected("Fond");
    } else if (pathname.startsWith("/bookmark")) {
      setSelected("Bookmark");
    } else if (pathname.startsWith("/settings")) {
      setSelected("Settings");
    }

    const roomMatch = pathname.match(/^\/room\/([^/]+)/);
    if (roomMatch) {
      const roomId = roomMatch[1];
      const matchedRoom = userRooms.find((room) => room.roomId === roomId);
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
      case "Fond":
        router.push("/fond");
        break;
      case "Bookmark":
        router.push("/bookmark");
        break;
      case "Settings":
        router.push("/settings");
        break;
      default:
        break;
    }
  };

  const isAuthPage = pathname?.startsWith("/auth");
  const isOnboardingPage = pathname?.startsWith("/onboarding");
  const isPrivacyPage = pathname?.startsWith("/privacy");
  const isNoNavPage = isAuthPage || isOnboardingPage || isPrivacyPage;
  const layoutClassName = `layout layout--${layoutMode}`;

  return (
    <SideMenuContext.Provider value={{ openSideMenu }}>
      <div className={isNoNavPage ? "" : layoutClassName}>
        {!isNoNavPage && (layoutMode === "expanded" || layoutMode === "compact") && (
          <div className="layout__side-nav-wrapper">
            <SideNavBar
              selected={selected}
              onChange={(value) => {
                setSelected(value);
                navigateTo(value);
              }}
              onLogOut={async () => {
                await supabase.auth.signOut();
              }}
            />
          </div>
        )}
        <main className="layout__main">
          {children}
        </main>
        {!isNoNavPage && layoutMode === "mobile" && (
          <BottomNavBar
            bottomSelectTab={bottomSelected}
            onChange={(value) => {
              setBottomSelected(value);
              navigateTo(value);
            }}
            currentRoom={currentRoom}
          />
        )}
        {!isNoNavPage && (layoutMode === "expanded" || layoutMode === "compact") && (
          <div className="layout__side-space" />
        )}
        {!isAuthPage && layoutMode === "mobile" && isMobileSideMenuOpen && (
          <>
            <div
              className="layout__drawer-overlay"
              onClick={() => setIsMobileSideMenuOpen(false)}
            />
            <div className="layout__drawer">
              <SideNavBar
                  selected={selected}
                onChange={(value) => {
                  setSelected(value);
                  navigateTo(value);
                  setIsMobileSideMenuOpen(false);
                }}
                onLogOut={async () => {
                  await supabase.auth.signOut();
                  setIsMobileSideMenuOpen(false);
                }}
              />
            </div>
          </>
        )}
      </div>
    </SideMenuContext.Provider>
  );
}
