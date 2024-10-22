import Image from "next/image";
import Leads from "./components/Leads";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center p-12">
        <Leads />
      </main>
    </div>
  );
}
