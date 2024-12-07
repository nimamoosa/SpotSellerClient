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
  toast: { title?: string; description: string };
  setToast: Dispatch<SetStateAction<{ title?: string; description: string }>>;
  openToast: boolean;
  setOpenToast: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

const ControllerContext = createContext<ControllerContextProp>({
  auth: "",
  setAuth: () => {},
  code: "",
  setCode: () => {},
  toast: { title: "", description: "" },
  setToast: () => {},
  openToast: false,
  setOpenToast: () => {},
  isLoading: false,
  setIsLoading: () => {},
  name: "",
  setName: () => {},
});

export default function ControllerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [auth, setAuth] = useState("");
  const [code, setCode] = useState("");
  const [toast, setToast] = useState<{ title?: string; description: string }>({
    title: "",
    description: "",
  });
  const [openToast, setOpenToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  return (
    <ControllerContext.Provider
      value={{
        auth,
        setAuth,
        code,
        setCode,
        toast,
        setToast,
        openToast,
        setOpenToast,
        isLoading,
        setIsLoading,
        name,
        setName,
      }}
    >
      {children}
    </ControllerContext.Provider>
  );
}

export const useController = () => useContext(ControllerContext);
