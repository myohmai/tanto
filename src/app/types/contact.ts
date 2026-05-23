export type ContactType = 'bug' | 'deletion' | 'open_room';

export type ContactStatus = 'pending' | 'reviewed' | 'resolved';

export type UserContact = {
    id: string;
    userId: string;
    type: ContactType;
    title: string;
    body: string;
    status: ContactStatus;
    createdAt: number;
};
