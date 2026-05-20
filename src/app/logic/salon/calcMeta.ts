import type { SalonData } from "@/app/types/salon";
import type { GlossData } from "@/app/types/gloss";

export const calcSalonMeta = (
    salons: SalonData[],
    glosses: GlossData[]
) => {
    return salons.map(salon => {
        const salonGlosses = glosses.filter(
            g => g.salonId === salon.salonId
        );

        return {
            ...salon,
            glossCount: salonGlosses.length,
            latestPostedAt:
                salonGlosses.sort((a, b) =>
                    Number(b.postedAt) - Number(a.postedAt)
                )[0]?.postedAt ?? "",
            latestImages:
                salonGlosses
                    .flatMap(g => g.media?.source ?? [])
                    .filter(m => m.type === "image")
                    .slice(0, 3)
                    .map(m => m.url),
        };
    });
};