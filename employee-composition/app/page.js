import CompanyForm from "./components/CompanyForm";

export default function Home() {
  return (
    <div className="p-12">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CompanyForm />
      </main>
    </div>
  );
}
