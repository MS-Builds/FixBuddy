import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { MainLayout } from "./layout/MainLayout";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FindProfessionals = lazy(() => import("./pages/FindProfessionals"));
const NewRequest = lazy(() => import("./pages/NewRequest"));
const MyRequests = lazy(() => import("./pages/MyRequests"));
const Chat = lazy(() => import("./pages/Chat"));
const Profile = lazy(() => import("./pages/Profile"));
const RequestDetails = lazy(() => import("./pages/RequestDetails"));
const CaptainProfile = lazy(() => import("./pages/CaptainProfile"));

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/find" element={<FindProfessionals />} />
                            <Route path="/requests" element={<MyRequests />} />
                            <Route path="/requests/new" element={<NewRequest />} />
                            <Route path="/requests/:id" element={<RequestDetails />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/professionals/:id" element={<CaptainProfile />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
