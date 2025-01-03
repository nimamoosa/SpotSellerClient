"use client";

import ToggleButton from "@/components/toggel_button";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/authContext";
import { useController } from "@/contexts/controllerContext";
import { useCooperationSales } from "@/contexts/cooperationSaleContext";
import { useCourse } from "@/contexts/courseContext";
import { useRegisteredUsers } from "@/contexts/registeredUsersContext";
import useLoading from "@/hooks/useLoading";
import { useSocketRequest } from "@/hooks/useSocketRequest";
import { cn } from "@/lib/utils";
import { AvailableUsersType } from "@/types/cooperationSaleType";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function CooperationInSales() {
  const {
    cooperationSalesClient,
    setCooperationSalesClient,
    isLoadingCooperationSalesClient,
  } = useCooperationSales();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { sendEvent, receiverEvent } = useSocketRequest();
  const { user } = useAuth();
  const { addAlert } = useController();
  const { courses } = useCourse();
  const { registeredUsers } = useRegisteredUsers();

  const [open, setOpen] = useState(false);
  const [availableUser, setAvailableUser] = useState<AvailableUsersType[]>([]);

  useEffect(() => {
    receiverEvent("createCooperationInSalesEventReceiver", (data) => {
      stopLoading();

      if (!data.success) return addAlert(data.message, "error");

      setCooperationSalesClient(data.data);
    });
  }, []);

  useEffect(() => {
    receiverEvent("updateCooperationFieldEventReceiver", (data) => {
      stopLoading();

      if (!data) return addAlert(data.message, "error");

      if (data.result.successful[0].method === "update_all_users") {
        addAlert("کاربران با موفقیت ذخیره شده اند", "success");
      } else {
        addAlert("تغییرات با موفقیت ذخیره شد", "success");
      }

      setCooperationSalesClient(data.result.successful[0].update);
    });
  }, []);

  useEffect(() => {
    if (!cooperationSalesClient) return;

    setAvailableUser(cooperationSalesClient.available_users);
  }, [cooperationSalesClient]);

  const handleToggleButtonClick = () => {
    startLoading();

    const available_courses = (() => {
      return courses.map((item) => ({
        courseId: item._id,
        share: 0,
        share_for_users: [],
      }));
    })();

    const available_users = (() => {
      return registeredUsers.map((item) => ({
        userId: item.userId,
        name: item.name,
      }));
    })();

    if (!cooperationSalesClient) {
      sendEvent("createCooperationInSales", {
        botId: user?.botId,
        userId: user?.userId,
        available_users,
        available_courses,
      });
      return;
    }

    sendEvent("updateCooperationField", {
      userId: user?.userId,
      botId: user?.botId,
      update_fields: [
        {
          method: "change_status",
          field: {
            status: !cooperationSalesClient.settings.status,
          },
        },
      ],
    });
  };

  const saveUsers = () => {
    startLoading();

    const data = {};

    Object.assign(data, {
      userId: user?.userId,
      botId: user?.botId,
      update_fields: [
        {
          method: "update_all_users",
          field: {
            available_users: availableUser,
          },
        },
      ],
    });

    sendEvent("updateCooperationField", data);
  };

  const isDisabled = () => {
    if (!cooperationSalesClient || isLoading || !registeredUsers) return true;

    if (availableUser.length <= 0) return true;

    const areSharesEqual =
      availableUser.length === cooperationSalesClient.available_users.length &&
      availableUser.every((user) =>
        cooperationSalesClient.available_users.some(
          (clientUser) => clientUser.userId === user.userId
        )
      );

    return areSharesEqual;
  };

  return (
    <div>
      <header className="flex items-center gap-5">
        <ToggleButton
          active={cooperationSalesClient?.settings?.status || false}
          active_text="فعال"
          inactive_text="غیر فعال"
          inactive_class="text-[12px]"
          loading={isLoadingCooperationSalesClient}
          disabled={isLoadingCooperationSalesClient || isLoading}
          onClick={handleToggleButtonClick}
        />
      </header>

      <main className="mt-6 overflow-auto h-full">
        <section className="flex flex-col justify-center gap-5">
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[400px] h-[5.5vh] justify-between"
                >
                  {availableUser.length === registeredUsers.length
                    ? "همه ی کاربران"
                    : "کاربران خاص"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[400px] p-0" dir="ltr">
                <Command>
                  <CommandInput placeholder="userId را وارد کنید" />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>

                    <CommandGroup>
                      {availableUser.length !== registeredUsers.length ? (
                        <CommandItem
                          className="cursor-pointer"
                          key={"for_all_user"}
                          value={"for_all_user"}
                          onSelect={() => {
                            setAvailableUser(registeredUsers);
                          }}
                        >
                          برای همه ی کاربران
                        </CommandItem>
                      ) : (
                        <></>
                      )}

                      {registeredUsers.map((user) => (
                        <CommandItem
                          className="cursor-pointer"
                          key={user.userId.toString()}
                          value={user.userId.toString()}
                          onSelect={(currentValue) => {
                            setAvailableUser((prev) =>
                              prev.some(
                                (item) => item.userId === Number(currentValue)
                              )
                                ? prev.filter(
                                    (item) =>
                                      item.userId !== Number(currentValue)
                                  )
                                : [...prev, { ...user }]
                            );
                          }}
                        >
                          {user.name} - {user.userId.toString()}
                          <Check
                            className={cn(
                              "ml-auto",
                              availableUser.some(
                                (item) => item.userId === user.userId
                              )
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Button
              variant={"ghost"}
              className="border-2 h-[5vh] w-[9%]"
              disabled={isDisabled()}
              onClick={saveUsers}
            >
              ذخیره
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
