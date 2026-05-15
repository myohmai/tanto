export type ReportType =
    | 'offensive'
    | 'unverified'
    | 'inappropriate'
    | 'identifiable'
    | 'adult';

export type Report = {
    type: ReportType;
    createdAt: number;
};