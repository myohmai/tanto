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
