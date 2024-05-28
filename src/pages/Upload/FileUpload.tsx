import { useState } from "react";
import { useDropzone } from 'react-dropzone';
import { FileMetadata } from "./types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';

function FileUpload() {

    const { isPending, data: files, refetch } = useQuery({
        queryKey: ['filesData'],
        queryFn: getFiles,
        retry: false
    });

    const [uploadProgress, setUploadProgress] = useState(0);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            uploadFileInChunks(acceptedFiles[0]);
        },
        multiple: false
    });


    async function getFiles() {
        const response = await fetch('http://localhost:4000/files/get-available-files');
        const { files } = await response.json();
        return files;
    }


    async function uploadFileInChunks(file: File) {
        const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
        const totalChunks = Math.ceil(file.size / chunkSize);

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(file.size, start + chunkSize);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkNumber', String(i + 1));
            formData.append('totalChunks', String(totalChunks));
            formData.append('fileName', file.name);

            try {
                await fetch('http://localhost:4000/files/upload-chunk', {
                    method: 'POST',
                    body: formData
                });

                const percentCompleted = Math.round(((i + 1) / totalChunks) * 100);
                setUploadProgress(percentCompleted);
            } catch (error) {
                console.error('Error uploading file', error);
            }
        }

        refetch();
    }

    return (
        <>
            <div className="flex items-center flex-col pt-4">
                <div {...getRootProps()} className="border-2 border-dashed p-4 rounded-md w-full h-[300px] flex justify-center items-center">
                    <input {...getInputProps()} />
                    <p>Drag and drop files here, or click to select a file</p>
                </div>
                <div className="mt-4">
                    {uploadProgress > 0 && uploadProgress !== 100 && <p>Uploading: {uploadProgress}%</p>}
                    {uploadProgress === 100 && <p className="text-green-500">Uploaded!</p>}
                </div>
            </div>
            {
                isPending ?
                    <div>Loading...</div> :
                    <div className="flex items-center flex-col">
                        <Table>
                            <TableCaption>{files.length > 0 ? 'Uploaded File(s)' : 'No files uploaded'}</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Extension</TableHead>
                                    <TableHead>Size</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    files.map((file: FileMetadata) => (
                                        <TableRow key={file.id}>
                                            <TableCell className="font-medium">{file.name}</TableCell>
                                            <TableCell className="font-medium">{file.extension}</TableCell>
                                            <TableCell className="font-medium">{(file.size / 1024 / 1024).toFixed(2)}MB</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
            }
        </>
    )
}

export default FileUpload;
