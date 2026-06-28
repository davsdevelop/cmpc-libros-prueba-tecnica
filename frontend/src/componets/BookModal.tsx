import { useState, useEffect } from 'react';
import api from '../services/api';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: any;
  onSave: () => void;
}


export default function BookModal({ isOpen, onClose, book, onSave }: BookModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    editorial: '',
    genre: '',
    price: 0,
    imageUrl: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author?.name || '',
        editorial: book.editorial?.name || '',
        genre: book.genre?.name || '',
        price: book.price || 0,
        imageUrl: book.imageUrl || ''
      });
    } else {
      setFormData({ title: '', author: '', editorial: '', genre: '', price: 0, imageUrl: '' });
    }
  }, [book, isOpen]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      alert("Título y Autor son obligatorios");
      return;
    }
    if (book) await api.patch(`/books/${book.id}`, formData);
    else await api.post('/books', formData);
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '300px' }}>
        <h2>{book ? 'Editar Libro' : 'Nuevo Libro'}</h2>
        <input placeholder="Título" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input placeholder="Autor" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input placeholder="Editorial" value={formData.editorial} onChange={(e) => setFormData({ ...formData, editorial: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input placeholder="Género" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input type="number" placeholder="Precio" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input
          placeholder="URL de la Imagen"
          value={formData.imageUrl || ''}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Cancelar</button>
      </form>
    </div>
  );
}