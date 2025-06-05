export default function Contact() {
  return (
    <main className="min-h-screen p-8 flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">Fale Conosco</h1>
      <form className="flex flex-col gap-4 w-full max-w-md">
        <input type="email" placeholder="Seu email" className="border p-2" />
        <textarea placeholder="Mensagem" className="border p-2" rows={4} />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">Enviar</button>
      </form>
    </main>
  );
}
