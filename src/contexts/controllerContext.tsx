"use client";

import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from "react";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertState {
  id: string; // Unique identifier for each alert
  text: string;
  type?: AlertType;
  timeout: number; // Time before auto-removal in milliseconds
}

type AlertAction =
  | {
      type: "ADD_ALERT";
      payload: { text: string; type?: AlertType; timeout?: number };
    }
  | { type: "REMOVE_ALERT"; payload: { id: string } }
  | { type: "CLEAR_ALERTS" };

function alertReducer(state: AlertState[], action: AlertAction): AlertState[] {
  switch (action.type) {
    case "ADD_ALERT":
      return [
        ...state,
        {
          id: Buffer.from(Date.now().toString()).toString("base64"),
          timeout: action.payload.timeout ?? 3000,
          ...action.payload,
        },
      ];
    case "REMOVE_ALERT":
      return state.filter((alert) => alert.id !== action.payload.id);
    case "CLEAR_ALERTS":
      return [];
    default:
      return state;
  }
}

interface ControllerContextProp {
  auth: string;
  setAuth: Dispatch<React.SetStateAction<string>>;
  code: string;
  setCode: Dispatch<React.SetStateAction<string>>;
  alerts: AlertState[];
  addAlert: (text: string, type?: AlertType, timeout?: number) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  isLoading: boolean;
  setIsLoading: Dispatch<React.SetStateAction<boolean>>;
  name: string;
  setName: Dispatch<React.SetStateAction<string>>;
  isDisconnect: boolean;
  setIsDisconnect: Dispatch<React.SetStateAction<boolean>>;
  linkController: { controller: string; link: string }[];
  setLinkController: Dispatch<
    React.SetStateAction<{ controller: string; link: string }[]>
  >;
  addLink: (link: string, controller: string) => void;
  removeLink: (controller: string) => void;
}

const ControllerContext = createContext<ControllerContextProp>({
  auth: "",
  setAuth: () => {},
  code: "",
  setCode: () => {},
  alerts: [],
  addAlert: () => {},
  removeAlert: () => {},
  clearAlerts: () => {},
  isLoading: false,
  setIsLoading: () => {},
  name: "",
  setName: () => {},
  linkController: [],
  setLinkController: () => {},
  isDisconnect: false,
  setIsDisconnect: () => {},
  addLink: () => {},
  removeLink: () => {},
});

export default function ControllerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [auth, setAuth] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [linkController, setLinkController] = useState<
    { controller: string; link: string }[]
  >([]);
  const [isDisconnect, setIsDisconnect] = useState(false);

  const [alerts, dispatchAlerts] = useReducer(alertReducer, []);

  const addAlert = (text: string, type?: AlertType, timeout = 3000) => {
    const id = Date.now().toString();
    dispatchAlerts({ type: "ADD_ALERT", payload: { text, type, timeout } });

    // Auto-remove alert after the specified timeout
    setTimeout(() => {
      dispatchAlerts({ type: "REMOVE_ALERT", payload: { id } });
    }, timeout);
  };

  const removeAlert = (id: string) => {
    dispatchAlerts({ type: "REMOVE_ALERT", payload: { id } });
  };

  const clearAlerts = () => {
    dispatchAlerts({ type: "CLEAR_ALERTS" });
  };

  const addLink = (link: string, controller: string) =>
    setLinkController((prev) => [...prev, { link, controller }]);

  const removeLink = (controller: string) =>
    setLinkController((prev) =>
      prev.filter((item) => item.controller !== controller)
    );

  return (
    <ControllerContext.Provider
      value={{
        auth,
        setAuth,
        code,
        setCode,
        alerts,
        addAlert,
        removeAlert,
        clearAlerts,
        isLoading,
        setIsLoading,
        name,
        setName,
        linkController,
        setLinkController,
        isDisconnect,
        setIsDisconnect,
        addLink,
        removeLink,
      }}
    >
      {children}
    </ControllerContext.Provider>
  );
}

export const useController = () => useContext(ControllerContext);
