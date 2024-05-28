import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "./types";
import { useEffect } from "react";
import LoadingBar from "@/components/custom/LoadingBar";
import { Link } from "react-router-dom";

function JobTile(props: Job & { savedState: { progress: number, canceled: boolean, startTime: number, endTime: number | null }, setJobState: (jobState: object) => void }) {

    const { savedState = { progress: 0, canceled: false, startTime: Date.now(), endTime: null } } = props;

    // Mimic progress bar until backend is finished
    useEffect(() => {
        const interval = setInterval(
            () => {
                if (savedState.progress === 100 || savedState.canceled) {
                    clearInterval(interval);
                }
                else {
                    props.setJobState({ ...savedState, progress: Math.min(100, savedState.progress + Math.floor(Math.random() * 3)) });
                }
            },
            100,
        );
        return () => clearInterval(interval);
    }, [savedState]);

    // Handles removing the cancel button without delay
    useEffect(() => {
        if ((savedState.canceled || savedState.progress === 100) && savedState.endTime === null) {
            props.setJobState({ ...savedState, endTime: Date.now() });
        }
    }, [savedState.progress, savedState.canceled])


    // Was going to handle all of this through the props.status but for sake of time just doing these checks instead
    function Status() {
        if (savedState.progress === 100) {
            return <div className="bg-green-500 w-fit p-1 rounded">Completed</div>;
        }
        else if (savedState.canceled) {
            return <div className="bg-red-400 w-fit p-1 rounded">Canceled</div>;
        }
        else if (props.status === "inprogress") {
            return (
                <>
                    <div className="text-yellow-500">In Progress</div>
                    <LoadingBar progress={savedState.progress || 0} />
                </>
            )
        }
        return null;
    }

    function DateNostartTime() {
        if (savedState.endTime) {
            return Math.round((savedState.endTime - savedState.startTime) / 1000 * 10) / 10;
        }
    }

    const isStillWorking = (savedState.endTime === null);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{props.job_name}</CardTitle>
                <CardDescription>{props.file_name}.{props.extension}</CardDescription>
            </CardHeader>
            <CardContent className="h-12">
                <Status />
                {
                    !isStillWorking && (
                        <div className="text-gray-500">took: {DateNostartTime()}s</div>
                    )
                }
            </CardContent>
            <CardFooter>
                <div className={`flex w-full ${isStillWorking ? 'justify-between' : 'justify-end'}`}>
                    {isStillWorking && <Button variant="destructive" onClick={() => props.setJobState({ ...savedState, canceled: true })}>Cancel</Button>}
                    <Button disabled={true} variant="outline">
                        <Link to={`/jobs/${props.id}`}>Details</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card >
    )
}

export default JobTile;