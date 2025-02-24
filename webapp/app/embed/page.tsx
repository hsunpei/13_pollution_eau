import Map from "@/components/Map";

export default function Embed() {
  return (
    <div className="flex flex-col min-h-screen w-screen h-screen">
      <main className="flex-1 w-full h-full">
        <Map style={{ width: "100%", height: "100%" }} />
      </main>
    </div>
  );
}
