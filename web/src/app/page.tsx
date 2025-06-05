export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Bem-vindo ao WPTW</h1>
      <p className="text-center max-w-xl">
        Plataforma colaborativa e 100% anônima para avaliar empresas e compartilhar experiências de trabalho.
      </p>
      <a className="text-blue-500 underline" href="/platform">Acessar plataforma</a>
    </main>
  );
}
