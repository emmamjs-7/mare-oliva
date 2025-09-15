import type { RouteObject } from "react-router-dom";
import { createElement } from "react";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import MenuPage from "./pages/MenuPage";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";

type PageWithRoute = React.ComponentType & { route?: Partial<RouteObject> & { index?: number; }; };

const pages: PageWithRoute[] = [AboutPage, NotFoundPage, MenuPage, HomePage, BookingPage];

export default pages
  .map((Comp) => {
    const r = Comp.route;
    if (!r) return null; // saknar route => hoppa över eller logga varning
    return { ...r, element: createElement(Comp) } as RouteObject;
  })
  .filter(Boolean) as RouteObject[];
