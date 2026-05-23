export type EntityType = 'external' | 'tag';
export type ExternalService = 'spotify' | 'youtube' | 'appleMusic';

export type Entity = {
    entityId: string;
    label: string;
    entityType: EntityType;
    canonicalEntityId?: string;
    parentEntityId?: string;
    externalService?: ExternalService;
    externalId?: string;
    thumbnailUrl?: string;
};

export type UserRoomEntity = {
    userId: string;
    roomId: string;
    entityId: string;
};

export type UserDisInterest = {
    userId: string;
    entityId: string;
    createdAt: string;
};

export type EntityMergeProposalStatus = 'pending' | 'approved' | 'rejected';

export type EntityMergeProposal = {
    proposalId: string;
    sourceEntityId: string;
    targetEntityId: string;
    proposedBy: string;
    approvedBy?: string;
    status: EntityMergeProposalStatus;
    createdAt: string;
};
