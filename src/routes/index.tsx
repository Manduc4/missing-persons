import { Navigate, useRoutes } from "react-router-dom";
import Register from "../screens/unauthenticated/register";
import { Layout } from "../layouts/dashboard/layout";
import NotFound from "../screens/404";
import Home from "../screens/home";
import { Login } from "../screens/unauthenticated/login";
import GuestUser from "../guards/GuestUser";
import UserGuard from "../guards/UserGuard";
import UsersList from "../screens/users";
import Recovery from "../screens/unauthenticated/recovery";
import MissingPersons from "../screens/missing-persons/list";
import MissingPerson from "../screens/missing-persons/details";

export default function Router() {
  return useRoutes([
    {
      path: "/cadastro",
      element: (
        <GuestUser>
          <Register />
        </GuestUser>
      ),
    },
    {
      path: "/login",
      element: (
        <GuestUser>
          <Login />
        </GuestUser>
      ),
    },
    {
      path: "/recuperar-senha",
      element: (
        <GuestUser>
          <Recovery />
        </GuestUser>
      ),
    },
    {
      path: "/",
      element: (
        <Layout />
      ),
      children: [
        {
          path: "/",
          element: <MissingPersons />,
        },
        {
          path: "/:id",
          element: <MissingPerson />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
  ]);
}
