import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import FileUpload from "./pages/Upload/FileUpload";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/JobDetails/JobDetails";
import Navigator from "./components/custom/Navigator";
import Container from "./components/custom/Container";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppDataProvider from "./AppContext";

const queryClient = new QueryClient()

export default function App() {

  return (
    <AppDataProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
          <div className="w-full h-screen md:grid md:grid-cols-[200px_1fr]">
            <Navigator />
            <Container>
              <Routes>
                <Route path="/" element={<Navigate to="/upload" replace />} />
                <Route path="/upload" Component={FileUpload} />
                <Route path="/jobs" Component={Jobs} />
                <Route path="/jobDetails/:id" Component={JobDetails} />
              </Routes>
            </Container>
          </div>
        </BrowserRouter>
      </QueryClientProvider>2
    </AppDataProvider>
  );
}
