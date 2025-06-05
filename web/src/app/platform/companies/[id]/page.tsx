'use client';
export const dynamic = 'force-dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

interface Review {
  id: string;
  rating: number;
  comment: string;
}

export default function CompanyPage() {
  const params = useParams();
  const companyId = params?.id as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [last, setLast] = useState<any>(null);
  const [filter, setFilter] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (!companyId) return;
    getDoc(doc(db, 'companies', companyId)).then(snap => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCompany({ id: snap.id, ...(snap.data() as any) });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadMore();
  }, [companyId]);

  const loadMore = async () => {
    if (!companyId) return;
    let q = query(collection(db, 'companies', companyId, 'reviews'), orderBy('createdAt', 'desc'), limit(5));
    if (last) q = query(q, startAfter(last));
    if (filter !== null) q = query(q, orderBy('rating'), limit(5));
    const snap = await getDocs(q);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newReviews = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    setReviews(prev => [...prev, ...newReviews]);
    setLast(snap.docs[snap.docs.length - 1]);
  };

  const submitReview = async () => {
    if (!companyId || !newReview) return;
    await addDoc(collection(db, 'companies', companyId, 'reviews'), {
      rating: newRating,
      comment: newReview,
      createdAt: new Date()
    });
    setReviews([]);
    setLast(null);
    setNewReview('');
    loadMore();
  };

  const filteredReviews = reviews.filter(r => {
    return (filter === null || r.rating === filter) && r.comment.toLowerCase().includes(text.toLowerCase());
  });

  return (
    <main className="p-8 max-w-xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{company?.name}</h1>
      <p>Média: {company?.averageRating?.toFixed(1) ?? 'N/A'}</p>
      <div className="flex gap-2 items-center">
        <input type="number" min="1" max="5" value={newRating} onChange={e => setNewRating(Number(e.target.value))} className="border p-1 w-16" />
        <input value={newReview} onChange={e => setNewReview(e.target.value)} placeholder="Comentário" className="border p-1 flex-1" />
        <button onClick={submitReview} className="bg-blue-500 text-white px-2">Enviar</button>
      </div>
      <div className="flex gap-2">
        <input type="number" placeholder="Filtrar nota" value={filter ?? ''} onChange={e => setFilter(e.target.value ? Number(e.target.value) : null)} className="border p-1" />
        <input placeholder="Buscar" value={text} onChange={e => setText(e.target.value)} className="border p-1 flex-1" />
      </div>
      <ul className="flex flex-col gap-2">
        {filteredReviews.map(r => (
          <li key={r.id} className="border p-2">
            <div>Nota: {r.rating}</div>
            <p>{r.comment}</p>
          </li>
        ))}
      </ul>
      <button onClick={loadMore} className="border p-2">Carregar mais</button>
    </main>
  );
}
