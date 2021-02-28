import React from "react";

import { RouterContext } from "./components/Router";

export function useNavigoRouter() {
  const ctx = useRouterContext();

  return ctx.router;
}

export function useRouterContext() {
  const ctx = React.useContext(RouterContext);
  if (!ctx) {
    throw Error('Router did not load');
  }

  return ctx;
}

