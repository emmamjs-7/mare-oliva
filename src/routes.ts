import { createElement } from "react";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import MenuPage from "./pages/MenuPage";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import CreateDish from "./pages/CreateDish";
import type Route from "./interfaces/Route";
import LoginPage from "./pages/loginPage";

export default [
  AboutPage,
  NotFoundPage,
  MenuPage,
  LoginPage,
  HomePage,
  BookingPage,
  CreateDish
]
  // map the route property of each page component to a Route
  .map(x => (({ element: createElement(x), ...x.route }) as Route))
  // sort by index (and if an item has no index, sort as index 0)
  .sort((a, b) => (a.index || 0) - (b.index || 0));

