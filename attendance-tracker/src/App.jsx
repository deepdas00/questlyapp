import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import AcademicVault from "./pages/AcademicVault";
import LiveSchedule from "./pages/LiveShedule";
import ProjectCamp from "./pages/ProjectCamp";
import SmartSettings from "./pages/SmartSettings";
import SmartCompass from "./pages/SmartCompass";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

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
              <LiveSchedule />
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
