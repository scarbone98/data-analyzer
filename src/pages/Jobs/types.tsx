export type Job = {
    id: string;
    status: string;
    file_name: string;
    job_name: string;
    extension: string;
    progress?: number;
};