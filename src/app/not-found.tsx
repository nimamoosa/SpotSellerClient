import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10 text-white bg-black">
      <div className="mb-3">
        <h2 className="text-4xl">صفحه مورد نظر یافت نشد</h2>
      </div>

      <div className="bg-purple-950 p-2 rounded-lg shadow-md shadow-purple-900">
        <div>
          <Link href="/">
            <Button>برگشت به صفحه اصلی</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
