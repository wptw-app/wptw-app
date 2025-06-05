'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
}

export default function Platform() {
  const [name, setName] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'companies')).then(snapshot => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCompanies(snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
  }, []);

  const addCompany = async () => {
    if (!name) return;
    const doc = await addDoc(collection(db, 'companies'), { name });
    setCompanies([...companies, { id: doc.id, name }]);
    setName('');
  };

  return (
    <main className="p-8 flex flex-col gap-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Empresas</h1>
      <div className="flex gap-2">
        <input className="border p-2 flex-1" value={name} onChange={e => setName(e.target.value)} placeholder="Adicionar empresa" />
        <button className="bg-blue-500 text-white px-4" onClick={addCompany}>Adicionar</button>
      </div>
      <ul className="list-disc pl-4">
        {companies.map(c => (
          <li key={c.id}>
            <Link href={`/platform/companies/${c.id}`}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
