"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCooperationSales } from "@/contexts/cooperationSaleContext";

export default function Sales() {
  const { cooperationSales } = useCooperationSales();

  return (
    <div>
      <div>
        <div className="border border-[#D6D6D6] rounded-xl overflow-hidden">
          {cooperationSales ? (
            <Table className="w-full border-collapse">
              <TableHeader className="w-full">
                <TableRow className="font-medium text-[16px] bg-[#F6F6F6] border-b border-gray-300">
                  <TableHead className="border-l-2 p-4 border-l-[#C6C6C6] rounded-tr-lg bg-[#F6F6F6] text-start">
                    <p className="mr-3 w-fit">عنوان دوره</p>
                  </TableHead>

                  <TableHead className="text-center">وضعیت</TableHead>

                  <TableHead className="border-r-2 border-r-[#C6C6C6] text-center">
                    <p>عملیات</p>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody suppressHydrationWarning>
                {cooperationSales.sale_links.map((sale, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium border-l-[1px] text-[16px] border-l-[#C6C6C6]">
                        <p className="mr-5">{sale.user_info.name}</p>
                      </TableCell>

                      <TableCell>
                        <p>{sale.sales[0].name}</p>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div>not found</div>
          )}
        </div>
      </div>
    </div>
  );
}
