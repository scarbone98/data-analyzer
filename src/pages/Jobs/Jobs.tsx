import { useContext, useState } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton";
import CreateJobForm from "./CreateJobForm";
import { Job } from "./types";
import JobTile from "./JobTile";
import { Input } from "@/components/ui/input";
import { useSearchHook } from "@/hooks/useSearchHook";
import { useQuery } from '@tanstack/react-query';
import { AppDataContext, JobsProgressStateType } from "@/AppContext";

function Jobs() {

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['jobsData'],
        queryFn: loadAllJobs,
        retry: false
    });

    const { jobsProgressState, setJobsState } = useContext(AppDataContext);

    const [formOpen, setFormOpen] = useState({ drawer: false, dialogue: false });
    const { setSearchTerm, searchTerm, filteredData } = useSearchHook(data?.jobs, { includeScore: true, keys: ['job_name'] });

    async function loadAllJobs() {
        const response = await fetch('http://localhost:4000/jobs/all');
        const data = await response.json();
        return data;
    }

    async function handleFormSubmit(data: { name: string, file: number }, componentKey: string) {
        try {
            await fetch('http://localhost:4000/jobs/schedule', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json());

            refetch();

        } catch (error) {
            console.error(error);
        }

        setFormOpen({ ...formOpen, [componentKey]: false });
    }

    if (error) {
        return (
            <div className="flex items-center flex-col mt-8">
                <div className="flex flex-col items-center">
                    <div className="text-2xl text-red-500">An error occurred while fetching data is the backend local server running on port 4000?</div>
                </div>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="flex items-center flex-col relative mt-8">
                <div className="flex flex-col items-center space-y-10">
                    {
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex w-full">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center flex-col relative p-4">
            <div className="flex w-full md:hidden">
                <Drawer open={formOpen.drawer} onOpenChange={(value) => setFormOpen({ ...formOpen, drawer: value })}>
                    <div className="flex w-full gap-4">
                        <Input placeholder="Job Name" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <DrawerTrigger className="min-w-[75px] border-green-400 border-2 rounded hover:bg-green-400">Schedule</DrawerTrigger>
                    </div>
                    <DrawerContent>
                        <CreateJobForm onSubmit={(data) => handleFormSubmit(data, 'drawer')} />
                    </DrawerContent>
                </Drawer>
            </div>
            <div className="hidden md:flex justify-center w-full relative">
                <Dialog open={formOpen.dialogue} onOpenChange={(value) => setFormOpen({ ...formOpen, dialogue: value })}>
                    <Input className="w-5/12" placeholder="Job Name" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <DrawerTrigger className="absolute right-0 top-0 w-[150px] h-10 border-green-400 border-2 rounded hover:bg-green-400">Schedule</DrawerTrigger>
                    <DialogContent>
                        <CreateJobForm onSubmit={(data) => handleFormSubmit(data, 'dialogue')} />
                    </DialogContent>
                </Dialog>
            </div>
            {data.jobs?.length === 0 && <div className="text-2xl text-gray-500 w-full h-[400px] items-center flex justify-center">No jobs available</div>}
            <ul className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-4">
                {
                    (filteredData as Array<Job>).map((job) => (
                        <li key={`/jobDetails/${job.id}`} className="cursor-pointer flex-1">
                            <JobTile {...job} savedState={jobsProgressState[job.id]} setJobState={(value) => setJobsState((prev: JobsProgressStateType) => ({ ...prev, [job.id]: value } as JobsProgressStateType))} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Jobs;