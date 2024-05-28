import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function Navigator() {

    const location = useLocation();
    const routes = [{ path: "/upload", label: "Upload" }, { path: "/jobs", label: "Jobs" }];

    return (
        <nav className="flex justify-center p-4 border-b-2 sticky top-0 z-10 bg-white md:border-b-0 md:border-r-2">
            <ul className="w-full max-w-[1024px] flex justify-around md:flex-col md:justify-start md:gap-y-16">
                {routes.map(route => (
                    <li key={route.path} className={`text-xl md:text-3xl ${location.pathname.indexOf(route.path) >= 0 ? 'underline' : ''}`}>
                        <Link to={route.path}>{route.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navigator;