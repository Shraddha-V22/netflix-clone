import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./commmon/auth";
import Layout from "./components/Layout";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  // if (!user) {
  //   return <Navigate to="/login" />;
  // }
  return children;
}

function AppRouter() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="/manageProfiles" element={<Profile edit />} />
          <Route path="/browse" element={<Layout />}>
            <Route index element={<Browse />} />
          </Route>
          <Route path="/latest" element={<Layout />}>
            <Route index element={<h1>latest</h1>} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </>
    )
  );
  return <RouterProvider router={router}></RouterProvider>;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
