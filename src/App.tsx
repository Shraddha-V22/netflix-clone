import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import Browse from "./pages/Browse";
import Login from "./pages/Login";

function AppRouter() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<p>hello</p>} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<Layout />}>
          <Route index element={<Browse />} />
        </Route>
        <Route path="/latest" element={<Layout />}>
          <Route index element={<h1>latest</h1>} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router}></RouterProvider>;
}

export default function App() {
  return <AppRouter />;
}
