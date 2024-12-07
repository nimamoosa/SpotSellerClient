import { TransactionUsersType } from "@/types/visit";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function ViewCustomerPurchaseHistory({
  purchase,
}: {
  purchase: TransactionUsersType[];
}) {
  return <div>hi</div>;
}
