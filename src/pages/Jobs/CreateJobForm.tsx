import { useState, useEffect } from "react";
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Container from "@/components/custom/Container";

import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(3, { message: "Must be 3 or more characters long" }).max(25, { message: "Cannot be over 25 characters" }),
    file: z.number({ required_error: "File is required" })
});

type FileData = {
    id: number;
    name: string;
    extension: string;
    size: number;
    created_at: Date;
}

type FormData = z.infer<typeof formSchema>;

export default function CreateJobForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {

    const [files, setFiles] = useState<Array<FileData> | null>(null);
    const [filesLoading, setFilesLoading] = useState(false);

    const { register, handleSubmit, setValue, trigger, formState: { errors, isValid } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange'
    });

    useEffect(() => {
        (async () => {
            setFilesLoading(true);
            const response = await fetch('http://localhost:4000/files/get-available-files');
            const data = await response.json();
            setFiles(data?.files);
            setFilesLoading(false);
        })();
    }, []);

    return (
        <Container>
            <CardHeader>
                <CardTitle>Schedule a Job</CardTitle>
                <CardDescription>Run a job for a specific data set.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Job Name</Label>
                            <Input id="name" placeholder="Your job name" {...register('name', { required: true })} />
                            <div className="text-red-600 h-3">{errors.name?.message ? errors.name?.message : ''}</div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="file">File</Label>
                            <Select
                                disabled={filesLoading}
                                onValueChange={(value) => {
                                    setValue('file', parseInt(value));
                                    trigger('file');
                                }}
                            >
                                <SelectTrigger id="file">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {
                                        files?.map((file) => (
                                            <SelectItem key={file.id} value={`${file.id}`}>{file.name}.{file.extension} - {(file.size / 1024 / 1024).toFixed(2)}MB</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <div className="text-red-600 h-3">{errors.file?.message ? errors.file?.message : ''}</div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={!isValid}>Start</Button>
                </CardFooter>
            </form>
        </Container>
    )
}