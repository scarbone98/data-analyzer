type Props = {
    progress: number;
};

function LoadingBar({ progress }: Props) {
    return (
        <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-full bg-blue-500 rounded" style={{ width: `${progress}%` }}></div>
        </div>
    );
}

export default LoadingBar;