export type ReportType =
    | 'offensive'
    | 'unverified'
    | 'inappropriate'
    | 'identifiable'
    | 'adult';

export type Report = {
    reporterId: string;
    type: ReportType;
    createdAt: number;
};