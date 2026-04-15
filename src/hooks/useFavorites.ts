import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to manage user favorites (likes/saves) for events.
 * 
 * Since events currently use mock data (no UUID from DB), 
 * this hook works with the event_id column in user_favorites.
 * When events come from the real DB, the IDs will be proper UUIDs.
 * 
 * For now, we store the event title as a proxy identifier for
 * the like overlay state (filled/unfilled hearts).
 */
export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch user's favorites on mount
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('user_favorites')
        .select('event_id')
        .eq('user_id', user.id);

      if (data) {
        setFavoriteIds(new Set(data.map(f => f.event_id)));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = useCallback(async (eventId: string): Promise<boolean> => {
    if (!user) return false;

    const isFaved = favoriteIds.has(eventId);
    
    if (isFaved) {
      // Optimistic update
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) {
        // Revert on failure
        setFavoriteIds(prev => new Set(prev).add(eventId));
        console.error('Failed to remove favorite:', error.message);
        return false;
      }
    } else {
      // Optimistic update
      setFavoriteIds(prev => new Set(prev).add(eventId));

      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, event_id: eventId });

      if (error) {
        // Revert on failure
        setFavoriteIds(prev => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
        console.error('Failed to add favorite:', error.message);
        return false;
      }
    }

    return true;
  }, [user, favoriteIds]);

  const isFavorited = useCallback((eventId: string) => {
    return favoriteIds.has(eventId);
  }, [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorited, loading };
}
