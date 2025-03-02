//import Image from "next/image";
import Map from "@/components/Map";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import { Prelevement } from "@/types/prelevement";

export default async function Home() {
  const filePath = path.join(process.cwd(), "public", "commune-prelevement.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsedData = Papa.parse<Prelevement>(fileContent, { header: true }).data;
  const dataById = parsedData.reduce((acc: Record<string, Prelevement>, item) => {
    acc[item.id] = item;
    return acc;
  }, {} satisfies Record<string, Prelevement>);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-blue-700 text-white">
        <h1 className="text-2xl font-bold">
          Pollution de l&apos;Eau Potable en France
        </h1>
      </header>

      <main className="flex-1">
        <Map pollutionData={dataById} />
      </main>

      <footer className="p-4 bg-gray-100 text-center text-sm">
        <p>Données ouvertes sur la qualité de l&apos;eau en France</p>
      </footer>
    </div>
  );
}
