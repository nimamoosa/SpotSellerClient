"use client";

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
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
  loading?: boolean;
}

interface AlertButtonState {
  id: string; // Unique identifier for each alert
  text: string;
  buttons: { content: string; onClick: () => void }[];
  settings?: {
    close_after_click_button: boolean;
  };
}

const generateUniqueId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

type AlertAction =
  | {
      type: "ADD_ALERT";
      payload: {
        text: string;
        type?: AlertType;
        timeout?: number;
        loading?: boolean;
      };
    }
  | { type: "REMOVE_ALERT"; payload: { id: string } }
  | { type: "CLEAR_ALERTS" };

function alertReducer(state: AlertState[], action: AlertAction): AlertState[] {
  switch (action.type) {
    case "ADD_ALERT":
      return [
        ...state,
        {
          id: generateUniqueId(),
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

type AlertButtonAction =
  | {
      type: "ADD";
      payload: {
        text: string;
        buttons: { content: string; onClick: () => void }[];
        settings?: {
          close_after_click_button: boolean;
        };
      };
    }
  | { type: "REMOVE" };

function alertButtonReducer(
  state: AlertButtonState | null,
  action: AlertButtonAction
): AlertButtonState | null {
  switch (action.type) {
    case "ADD":
      if (state) return state;

      return {
        id: generateUniqueId(),
        ...action.payload,
      };

    case "REMOVE":
      return null;

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
  alertButtons: AlertButtonState | null;
  addAlert: (
    text: string,
    type?: AlertType,
    timeout?: number,
    loading?: boolean
  ) => void;
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
  node: { el: ReactNode | null; bgColor: string } | null;
  setNode: Dispatch<
    SetStateAction<{ el: ReactNode | null; bgColor: string } | null>
  >;
  layoutInfo: object | null;
  setLayoutInfo: Dispatch<SetStateAction<object | null>>;
  addAlertButton: (
    text: string,
    buttons: { content: string; onClick: () => void }[],
    settings?: {
      close_after_click_button: boolean;
    }
  ) => void;
  removeAlertButton: () => void;
}

const ControllerContext = createContext<ControllerContextProp>({
  auth: "",
  setAuth: () => {},
  code: "",
  setCode: () => {},
  alerts: [],
  alertButtons: null,
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
  node: null,
  setNode: () => {},
  layoutInfo: null,
  setLayoutInfo: () => {},
  addAlertButton: () => {},
  removeAlertButton: () => {},
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
  const [node, setNode] = useState<{
    el: ReactNode | null;
    bgColor: string;
  } | null>(null);
  const [layoutInfo, setLayoutInfo] = useState<object | null>(null);

  const [alerts, dispatchAlerts] = useReducer(alertReducer, []);
  const [alertButtons, dispatchAlertsButton] = useReducer(
    alertButtonReducer,
    null
  );

  const addAlert = (
    text: string,
    type?: AlertType,
    timeout = 3000,
    loading = false
  ) => {
    dispatchAlerts({
      type: "ADD_ALERT",
      payload: { text, type, timeout, loading },
    });
  };

  const removeAlert = (id: string) => {
    dispatchAlerts({ type: "REMOVE_ALERT", payload: { id } });
  };

  const addAlertButton = (
    text: string,
    buttons: { content: string; onClick: () => void }[],
    settings?: {
      close_after_click_button: boolean;
    }
  ) => {
    dispatchAlertsButton({ type: "ADD", payload: { text, buttons, settings } });
  };

  const clearAlerts = () => {
    dispatchAlerts({ type: "CLEAR_ALERTS" });
  };

  const addLink = (link: string, controller: string) => {
    if (
      linkController.some(
        (item) => item.link === link && item.controller === controller
      )
    )
      return;

    setLinkController((prev) => [...prev, { link, controller }]);
  };

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
        alertButtons,
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
        node,
        setNode,
        layoutInfo,
        setLayoutInfo,
        addAlertButton,
        removeAlertButton() {
          dispatchAlertsButton({ type: "REMOVE" });
        },
      }}
    >
      {children}
    </ControllerContext.Provider>
  );
}

export const useController = () => useContext(ControllerContext);
