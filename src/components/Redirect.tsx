import React from "react";
import { useNavigoRouter } from "../hooks";

type RouteProps = {
  to: string;
};

export function Redirect(props: RouteProps) {
  const { to } = props;
  const isRedirecting = React.useRef(false);
  const router = useNavigoRouter();

  React.useEffect(() => {
    if (isRedirecting.current === false) {
      // prevent updating parent component while rendering
      setTimeout(() => router.navigate(to), 0);
      isRedirecting.current = true;
    }
  }, []);

  return null;
}
