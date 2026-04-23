import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 p-8">
      <div className="text-sm tracking-[0.12em] text-orange-500 uppercase">Piramid Providers</div>
      <h1 className="text-4xl leading-tight font-semibold">Documentación, guías y API reference</h1>
      <p className="text-base text-neutral-600">
        Tres entradas en un solo lugar: guía para operadores, help-center para cuando algo no sale,
        y el contrato de la API para integradores.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/docs"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-neutral-100"
        >
          Documentación
        </Link>
        <Link
          href="/api-reference"
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          API Reference
        </Link>
      </div>
    </main>
  );
}
