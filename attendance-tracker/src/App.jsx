import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import AcademicVault from "./pages/AcademicVault";
import ProjectCamp from "./pages/ProjectCamp";
import SmartSettings from "./pages/SmartSettings";
import SmartCompass from "./pages/SmartCompass";
import PrivateRoute from "./components/PrivateRoute";
import TaskifyDashboard from "./pages/TaskifyDashboard";
import DownloadPage from "./pages/DownloadPage";
import ForgetPassword from "./pages/ForgotPassword";
import ScrollToTop from "./components/ScrollToTop";
import InstallPrompt from "./components/InstallPrompt";
import NotificationPrompt from "./components/NotificationPrompt";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <InstallPrompt />
        {/* <NotificationPrompt /> */}
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/academic"
          element={
            <PrivateRoute>
              <AcademicVault />
            </PrivateRoute>
          }
        />

        <Route
          path="/live-schedule"
          element={
            <PrivateRoute>
              <TaskifyDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/project-camp"
          element={
            <PrivateRoute>
              <ProjectCamp />
            </PrivateRoute>
          }
        />

        <Route
          path="/smart-setting"
          element={
            <PrivateRoute>
              <SmartSettings />
            </PrivateRoute>
          }
        />

        <Route
          path="/smart-compass"
          element={
            <PrivateRoute>
              <SmartCompass />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
