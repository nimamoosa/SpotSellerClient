"use client";

import { RegisteredUsersType } from "@/types/registeredUsersType";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authContext";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { Events, ReceiverEvents } from "@/enum/event";

interface RegisteredUsersContextProps {
  registeredUsers: RegisteredUsersType[];
  setRegisteredUsers: Dispatch<SetStateAction<RegisteredUsersType[]>>;
  isLoadingRegisteredUsers: boolean;
}

const RegisteredUsersContext = createContext<RegisteredUsersContextProps>({
  registeredUsers: [],
  setRegisteredUsers: () => {},
  isLoadingRegisteredUsers: true,
});

export default function RegisteredUsersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUsersType[]>(
    []
  );
  const [isLoadingRegisteredUsers, setIsLoadingRegisteredUsers] =
    useState<boolean>(true);

  const { user } = useAuth();

  const { sendEvent, receiverEvent } = useSocketRequest();

  useEffect(() => {
    if (user === null) return;

    sendEvent(Events.SIGNUP_USERS, { userId: user.userId });
  }, [user]);

  useEffect(() => {
    receiverEvent(ReceiverEvents.SIGNUP_USERS, (data) => {
      if (!data.success) return setIsLoadingRegisteredUsers(false);

      setRegisteredUsers(data.users);
      setIsLoadingRegisteredUsers(false);
    });
  }, []);

  return (
    <RegisteredUsersContext.Provider
      value={{ registeredUsers, setRegisteredUsers, isLoadingRegisteredUsers }}
    >
      {children}
    </RegisteredUsersContext.Provider>
  );
}

export const useRegisteredUsers = () => useContext(RegisteredUsersContext);
