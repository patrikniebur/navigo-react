import React from "react";
import Navigo from "navigo";

interface NavigoRouterProps {
  children: React.ReactNode;
}

export const RouterContext = React.createContext<
  { router: Navigo } | undefined
>(undefined);

export function Router(props: NavigoRouterProps) {
  const [instance] = React.useState<Navigo>(() => {
    return new Navigo("/", { noMatchWarning: true });
  });

  const value = React.useMemo(
    () => ({
      router: instance,
    }),
    [instance]
  );

  React.useEffect(() => {
    return () => {
      instance.destroy();
    }
  }, [instance]);

  if (!instance) return null;

  return (
    <RouterContext.Provider value={value}>
      {props.children}
    </RouterContext.Provider>
  );
}
