import React from 'react';
import type { Match } from 'navigo';

import { useNavigoRouter } from '../hooks';

type RouteProps = {
  children: React.ReactNode;
};

/* Shamelessly stolen from  */
/* https://github.com/ReactTraining/react-router/blob/be6a22f8c5a0d19011e42ed444ba77e0d4432f87/packages/react-router/modules/Switch.js */

export function Switch(props: RouteProps) {
  const [, setRouterMatch] = React.useState<Match | false>(false);
  const router = useNavigoRouter();
  let element: React.ReactElement | undefined;
  let match: Match | boolean = false;

  React.Children.forEach(props.children, (child) => {
    if (match === false && React.isValidElement(child)) {
      element = child;

      const path = child.props.path;

      match = path ? router.matchLocation(path) : true;
    }
  });

  React.useEffect(() => {
    let isMounted = true;
    function handler(match: Match) {
      if (isMounted) {
        setRouterMatch(match);
      }
    }

    router.on('*', handler);

    return () => {
      isMounted = false;
      router.off(handler);
    };
  }, [router]);

  return match && element
    ? React.cloneElement(element, element.props)
    : null;
}
