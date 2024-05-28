import { createContext, useState } from 'react';


export type JobsProgressStateType = {
    [key: string]: { progress: number; canceled: boolean; startTime: number; endTime: number | null };
};

type AppDataContextType = {
    jobsProgressState: JobsProgressStateType;
    setJobsState: (state: JobsProgressStateType | ((prevState: JobsProgressStateType) => JobsProgressStateType)) => void;
};

export const AppDataContext = createContext<AppDataContextType>({ jobsProgressState: {}, setJobsState: () => { } });

function AppDataProvider({ children }: { children: React.ReactNode }) {

    const [jobsProgressState, setJobsState] = useState({});

    return (
        <AppDataContext.Provider value={{ jobsProgressState, setJobsState }}>
            {children}
        </AppDataContext.Provider>
    );
}

export default AppDataProvider;
