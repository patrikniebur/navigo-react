import React from 'react';
import type { Match } from 'navigo';
import { useNavigoRouter } from '../hooks';

type RouteProps = {
  path: string;
  component: React.JSXElementConstructor<any>;
};

export function Route(props: RouteProps) {
  const { component: Component, path } = props;
  const router = useNavigoRouter();
  const [match, setMatch] = React.useState<Match | false>(() => {
    return router.matchLocation(path);
  });

  React.useEffect(() => {
    let isMounted = true;
    function handler() {
      if (isMounted) {
        setMatch(router.matchLocation(path));
      }
    }

    router.on(path, handler);
    router.resolve();

    return () => {
      router.off(handler);
      isMounted = false;
    };
  }, [path, router]);

  if (!match) return null;

  return <Component routeMatch={match} />;
}
