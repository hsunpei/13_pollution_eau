//import Image from "next/image";
import PollutionMap from "@/components/PollutionMap";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-blue-700 text-white">
        <h1 className="text-2xl font-bold">
          Pollution de l&apos;Eau Potable en France
        </h1>
      </header>

      <main className="flex-1">
        <PollutionMap />
      </main>
    </div>
  );
}
