import type { Topic } from "@/app/types";

export const mockTopics: Topic[] = [
    {
        topicId: "topic_1",
        roomId: "room_1",
        salonId: "salon_1",
        userId: "user_1",
        topicContent:
            "次のサロンで話したいテーマはありますか？最近気になっている音楽、映像、制作の悩みなどをゆるく聞かせてください。",
        postedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
        topicId: "topic_2",
        roomId: "room_1",
        salonId: "salon_1",
        userId: "user_2",
        topicContent:
            "作業中に流すBGMのおすすめを知りたいです。集中できるけど眠くならない感じのものがあれば教えてほしい。",
        mediaEmbed: {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
        topicId: "topic_3",
        roomId: "room_1",
        salonId: "salon_1",
        userId: "user_1",
        topicContent:
            "このビジュアルの方向性について、色味が少し強すぎるかどうか意見を聞きたいです。",
        media: {
            type: "original",
            source: [
                {
                    type: "image",
                    url: "https://picsum.photos/seed/topic-visual-1/800/600",
                },
            ],
        },
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
];
