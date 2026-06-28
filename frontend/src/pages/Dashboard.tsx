import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import BookModal from '../componets/BookModal';

const initialFilters = { title: '', author: '', editorial: '', genre: '', sortBy: 'title', order: 'asc' };

export default function Dashboard() {
  const [books, setBooks] = useState<any[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(handler);
  }, [filters, pagination.offset]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '')),
        ...pagination
      };
      const res = await api.get('/books', { params });
      setBooks(res.data.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  return (
    <div style={{ padding: '0', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#347734', color: 'white', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Biblioteca CMPC</h2>
        <div>
          <button onClick={() => { setSelectedBook(null); setIsModalOpen(true); }} style={{ marginRight: '10px' }}>+ Crear Libro</button>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>Logout</button>
        </div>
      </div>

      {/* Filtros y Ordenamiento */}
      <div style={{ padding: '10px', background: '#80AB31', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder="Título" value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} />
        <input placeholder="Autor" value={filters.author} onChange={(e) => setFilters({ ...filters, author: e.target.value })} />
        <input placeholder="Editorial" value={filters.editorial} onChange={(e) => setFilters({ ...filters, editorial: e.target.value })} />
        <input placeholder="Género" value={filters.genre} onChange={(e) => setFilters({ ...filters, genre: e.target.value })} />
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="title">Título</option>
          <option value="price">Precio</option>
        </select>
        <button onClick={() => setFilters(initialFilters)} style={{ background: '#ccc' }}>Limpiar</button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '20px' }}>Cargando...</div> : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#333', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Imagen</th>
                <th style={{ padding: '10px' }}>Título</th>
                <th style={{ padding: '10px' }}>Autor</th>
                <th style={{ padding: '10px' }}>Editorial</th>
                <th style={{ padding: '10px' }}>Género</th>
                <th style={{ padding: '10px' }}>Precio</th>
                <th style={{ padding: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? books.map((book) => (
                <tr key={book.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt="portada"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          console.error("Error al cargar la imagen:", book.imageUrl);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd', fontSize: '10px', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        No disponible
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>{book.title}</td>
                  <td style={{ padding: '10px' }}>{book.author?.name}</td>
                  <td style={{ padding: '10px' }}>{book.editorial?.name}</td>
                  <td style={{ padding: '10px' }}>{book.genre?.name}</td>
                  <td style={{ padding: '10px' }}>${book.price}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => { setSelectedBook(book); setIsModalOpen(true); }}>Editar</button>
                    <button onClick={() => handleDelete(book.id)} style={{ color: 'red', marginLeft: '5px' }}>Eliminar</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No hay registros.</td></tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <button disabled={pagination.offset === 0} onClick={() => setPagination({ ...pagination, offset: pagination.offset - 10 })}>Anterior</button>
            <span style={{ margin: '0 15px' }}>Página {pagination.offset / 10 + 1}</span>
            <button onClick={() => setPagination({ ...pagination, offset: pagination.offset + 10 })}>Siguiente</button>
          </div>
        </>
      )}

      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} book={selectedBook} onSave={fetchBooks} />
    </div>
  );
}