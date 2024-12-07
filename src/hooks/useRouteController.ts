import { useState } from "react";

export default function useRouteController() {
  const [route, setRoute] = useState("");

  return {
    route,
    setRoute,
  };
}
