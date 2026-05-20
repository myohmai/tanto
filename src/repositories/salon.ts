import type { SalonData } from "@/app/types";
import { mockSalons } from "@/mocks/salon";

const getCreatedSalons = (): SalonData[] => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("created-salons");
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

const getUpdatedSalons = (): SalonData[] => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("updated-salons");
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

const getDeletedSalonIds = (): string[] => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("deleted-salon-ids");
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

export const getSalons = async (): Promise<SalonData[]> => {
    const deletedSalonIds = new Set(getDeletedSalonIds());
    const updatedSalons = getUpdatedSalons();
    const createdSalons = getCreatedSalons();

    const salons = [...createdSalons, ...mockSalons]
        .filter((salon) => salon.salonId && !deletedSalonIds.has(salon.salonId))
        .map((salon) => {
            const updatedSalon = updatedSalons.find(
                (updatedSalon) => updatedSalon.salonId === salon.salonId
            );

            return updatedSalon ?? salon;
        });

    return salons;
};

export async function updateSalon(payload: SalonData) {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("updated-salons");
    const updatedSalons: SalonData[] = saved ? JSON.parse(saved) : [];

    const existsIndex = updatedSalons.findIndex(
        (s) => s.salonId === payload.salonId
    );

    if (existsIndex !== -1) {
        updatedSalons[existsIndex] = payload;
    } else {
        updatedSalons.push(payload);
    }

    localStorage.setItem("updated-salons", JSON.stringify(updatedSalons));
}

export async function deleteSalon(salonId: string) {
    if (typeof window === "undefined") return;

    const deletedSalonIds = localStorage.getItem("deleted-salon-ids");
    const list: string[] = deletedSalonIds ? JSON.parse(deletedSalonIds) : [];

    if (!list.includes(salonId)) {
        list.push(salonId);
    }

    localStorage.setItem("deleted-salon-ids", JSON.stringify(list));
}