import React, { lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./commmon/auth";
import ProfileProvider from "./commmon/profile-context";
const Layout = lazy(() => import("./components/Layout"));
import Loader from "./components/Loader";
const Browse = lazy(() => import("./pages/Browse"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Registration = lazy(() => import("./pages/Registration"));

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (!user && !loading) {
    return <Navigate to="/login" />;
  }
  return children;
}

function RouteError() {
  return (
    <article className="m-4 grid place-content-center gap-2 p-4">
      <h1 className="text-4xl">The page you're looking for doesn't exist</h1>
      <p className="text-2xl">
        Browse more content{" "}
        <Link className="text-netflixRed" to="/browse">
          here
        </Link>
      </p>
    </article>
  );
}

function AppRouter() {
  const { loading, user } = useAuth();
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
          errorElement={<RouteError />}
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
        <Route path="/signup" element={<Registration />} />
      </>
    )
  );
  return loading ? (
    <Loader />
  ) : (
    <React.Suspense fallback={<Loader />}>
      <RouterProvider router={router}></RouterProvider>
    </React.Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppRouter />
      </ProfileProvider>
    </AuthProvider>
  );
}
