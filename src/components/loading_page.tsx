import { Spinner } from "./ui/spinner";

export default function LoadingPage() {
  return (
    <div className="w-full max-w-[1600px] h-[100vh] fixed flex flex-col items-center justify-center bg-white/50">
      <section className="flex flex-col items-center justify-center">
        <div>
          <img src="/logo.svg" alt="" />
        </div>

        <div className="mt-10">
          <Spinner size={"medium"} />
        </div>
      </section>

      <section className="absolute bottom-2">
        <p>
          spotseller by <span className="text-blue-700">pixels</span>
        </p>
      </section>
    </div>
  );
}
