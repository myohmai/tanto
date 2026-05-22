"use client";
import { createContext, useContext } from "react";

type SideMenuContextType = {
    openSideMenu: () => void;
};

export const SideMenuContext = createContext<SideMenuContextType>({
    openSideMenu: () => {},
});

export const useSideMenu = () => useContext(SideMenuContext);
