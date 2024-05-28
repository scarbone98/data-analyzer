import Fuse from 'fuse.js';
import { useState, useMemo, useEffect } from "react";

type SearchOptions = {
    includeScore: boolean;
    keys: string[];
};

export const useSearchHook = (data: Array<object>, options: SearchOptions) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    const fuse = useMemo(() => new Fuse(data, options), [data]);

    useEffect(() => {
        if (searchTerm) {
            const results = fuse.search(searchTerm).map(result => result.item);
            setFilteredData(results);
        } else {
            setFilteredData(data || []);
        }
    }, [searchTerm, data, fuse]);

    return {
        setSearchTerm,
        searchTerm,
        filteredData
    };
};