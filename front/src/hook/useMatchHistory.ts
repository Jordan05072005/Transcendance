import { useState, useEffect } from 'react';
import { getMatchHistory, createMatch } from '../api/match.service';
import { getToken } from '../api/client';
import type { MatchHistory } from '../types/user.types';
import { useUser } from './useUser';

export const useMatchHistory = () => {
    const [matches, setMatches] = useState<MatchHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
		const { user } = useUser();
		

    const fetchMatches = async () => {
        const token = getToken();
        if (!token || !user.login) {
          setMatches([]);
          return;
        }

        setLoading(true);
        setError('');
        
        const response = await getMatchHistory();
        
        if ('error' in response) {
          setError(response.error);
          setMatches([]);
        } else {
          setMatches(response.matches || []);
        }
        
        setLoading(false);
    };

    const recordMatch = async (
        opponentUsername: string,
        playerScore: number,
        opponentScore: number
      ) => {
        const result = playerScore > opponentScore ? 'win' : 'loss';
        
        await createMatch({
          opponentUsername,
          playerScore,
          opponentScore,
          result,
        });
        //console.log(`recordMatch: ${opponentUsername}, ${playerScore}, ${opponentScore}`)
        await fetchMatches();
        return true;
    };

    useEffect(() => {
      fetchMatches();
    }, []);

    return {
      matches,
      loading,
      error,
      recordMatch,
      refetch: fetchMatches,
    };
};
