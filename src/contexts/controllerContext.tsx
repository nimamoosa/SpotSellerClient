"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ControllerContextProp {
  auth: string;
  setAuth: Dispatch<SetStateAction<string>>;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  alert: {
    text: string;
    type?: "success" | "error" | "info" | "warning";
  } | null;
  setAlert: Dispatch<
    SetStateAction<{
      text: string;
      type?: "success" | "error" | "info" | "warning";
    } | null>
  >;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  onCloseAlert: () => void;
}

const ControllerContext = createContext<ControllerContextProp>({
  auth: "",
  setAuth: () => {},
  code: "",
  setCode: () => {},
  alert: null,
  setAlert: () => {},
  isLoading: false,
  setIsLoading: () => {},
  name: "",
  setName: () => {},
  onCloseAlert: () => {},
});

export default function ControllerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [auth, setAuth] = useState("");
  const [code, setCode] = useState("");
  const [alert, setAlert] = useState<{
    text: string;
    type?: "success" | "error" | "info" | "warning";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSetAlert = (newAlert: {
    text: string;
    type?: "success" | "error" | "info" | "warning";
  }) => {
    setAlert(null); // Clear the current alert first
    setTimeout(() => {
      setAlert(newAlert); // Add the new alert after clearing
    }, 0); // Timeout ensures re-rendering properly
  };

  return (
    <ControllerContext.Provider
      value={{
        auth,
        setAuth,
        code,
        setCode,
        alert,
        setAlert,
        isLoading,
        setIsLoading,
        name,
        setName,
        onCloseAlert: () => {},
      }}
    >
      {children}
    </ControllerContext.Provider>
  );
}

export const useController = () => useContext(ControllerContext);
