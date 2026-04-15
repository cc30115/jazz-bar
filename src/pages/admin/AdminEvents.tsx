import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

const MOCK_EVENTS = [
  { id: '1', title: 'The Blue Notes Quartet', date_start: '2026-10-24', status: 'limited', ticker_tag: 'New Performance', price_standard: 8000, price_premium: 12000, price_vip: 25000 },
  { id: '2', title: 'Yumi & The Velvet', date_start: '2026-10-26', status: 'sold_out', ticker_tag: 'Sold Out', price_standard: 6500, price_premium: 10000, price_vip: null },
  { id: '3', title: 'Midnight Saxophone', date_start: '2026-10-31', status: 'available', ticker_tag: 'New Performance', price_standard: 5500, price_premium: 9000, price_vip: null },
];

export default function AdminEvents() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const handleEditClick = (event: any) => {
    setEditingId(event.id);
    setEditFormData({ ...event });
  };

  const handleSaveClick = () => {
    // 💡 Supabase Save Hook Here
    // supabase.from('events').update(editFormData).eq('id', editingId);
    
    setEvents(events.map(ev => ev.id === editingId ? editFormData : ev));
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ 
      ...prev, 
      [name]: name.startsWith('price_') && value !== '' ? parseInt(value) : value 
    }));
  };

  return (
    <div className="flex flex-col h-full text-cream">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-gold-400 tracking-wider mb-2">Events & Pricing</h1>
          <p className="text-cream/60 font-sans text-sm tracking-widest uppercase">Modify ticket prices, status, and ticker tags.</p>
        </div>
      </div>

      <div className="bg-dark/80 border border-gold-400/20 rounded-md overflow-hidden">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-gold-400/10 border-b border-gold-400/20">
            <tr>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal">Event Title & Date</th>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal">Global Status</th>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal">Ticker Tag</th>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal">Standard / Premium / VIP</th>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => {
              const isEditing = editingId === evt.id;

              return (
                <tr key={evt.id} className="border-b border-cream/5 hover:bg-cream/5 transition-colors">
                  <td className="p-4">
                    <div className="font-serif text-lg text-cream mb-1">{evt.title}</div>
                    <div className="text-xs text-gold-400 tracking-widest">{evt.date_start}</div>
                  </td>
                  
                  <td className="p-4">
                    {isEditing ? (
                      <select name="status" value={editFormData.status} onChange={handleChange} className="bg-dark border border-gold-400/50 p-2 text-cream outline-none focus:border-gold-400 w-full">
                        <option value="available">Available</option>
                        <option value="limited">Limited</option>
                        <option value="few_left">Few Left</option>
                        <option value="sold_out">Sold Out</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs uppercase tracking-widest border rounded-sm ${evt.status === 'sold_out' ? 'border-oatmeal text-oatmeal' : 'border-gold-400/50 text-gold-400'}`}>
                        {evt.status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  
                  <td className="p-4">
                    {isEditing ? (
                      <select name="ticker_tag" value={editFormData.ticker_tag} onChange={handleChange} className="bg-dark border border-gold-400/50 p-2 text-cream outline-none focus:border-gold-400 w-full">
                        <option value="New Performance">New Performance</option>
                        <option value="Special Guest">Special Guest</option>
                        <option value="Sold Out">Sold Out</option>
                        <option value="Pick Up">Pick Up</option>
                        <option value="Tonight">Tonight</option>
                      </select>
                    ) : (
                      <span className="text-cream/80">{evt.ticker_tag}</span>
                    )}
                  </td>

                  <td className="p-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-cream/50 w-8">STD</span>
                          <input type="number" name="price_standard" value={editFormData.price_standard || ''} onChange={handleChange} className="w-24 bg-dark border border-gold-400/50 p-1 px-2 text-cream" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-cream/50 w-8">PRM</span>
                          <input type="number" name="price_premium" value={editFormData.price_premium || ''} onChange={handleChange} className="w-24 bg-dark border border-gold-400/50 p-1 px-2 text-cream" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-cream/50 w-8">VIP</span>
                          <input type="number" name="price_vip" value={editFormData.price_vip || ''} onChange={handleChange} className="w-24 bg-dark border border-gold-400/50 p-1 px-2 text-cream" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-cream/80">STD: ¥{evt.price_standard || '-'}</div>
                        <div className="text-cream/80">PRM: ¥{evt.price_premium || '-'}</div>
                        <div className="text-cream/80">VIP: ¥{evt.price_vip || '-'}</div>
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-right align-top">
                    {isEditing ? (
                      <div className="flex justify-end space-x-2">
                        <button onClick={handleSaveClick} className="p-2 bg-green-900/40 text-green-400 hover:bg-green-900/60 rounded transaction-colors title='Save'">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-red-900/40 text-red-400 hover:bg-red-900/60 rounded transaction-colors title='Cancel'">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(evt)} className="p-2 bg-gold-400/10 text-gold-400 hover:bg-gold-400/20 rounded transaction-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
