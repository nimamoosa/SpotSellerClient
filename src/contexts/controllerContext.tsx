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
  linkController: { controller: string; link: string }[];
  setLinkController: Dispatch<
    SetStateAction<{ controller: string; link: string }[]>
  >;
  onCloseAlert: () => void;
  addLink: (link: string, controller: string) => void;
  removeLink: (controller: string) => void;
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
  linkController: [],
  setLinkController: () => {},
  onCloseAlert: () => {},
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
  const [alert, setAlert] = useState<{
    text: string;
    type?: "success" | "error" | "info" | "warning";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [linkController, setLinkController] = useState<
    { controller: string; link: string }[]
  >([]);

  const handleSetAlert = (newAlert: {
    text: string;
    type?: "success" | "error" | "info" | "warning";
  }) => {
    setAlert(null); // Clear the current alert first
    setTimeout(() => {
      setAlert(newAlert); // Add the new alert after clearing
    }, 0); // Timeout ensures re-rendering properly
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
        alert,
        setAlert,
        isLoading,
        setIsLoading,
        name,
        setName,
        linkController,
        setLinkController,
        onCloseAlert: () => {},
        addLink,
        removeLink,
      }}
    >
      {children}
    </ControllerContext.Provider>
  );
}

export const useController = () => useContext(ControllerContext);
