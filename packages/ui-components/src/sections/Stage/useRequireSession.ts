import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../../providers/AuthProvider';
import { Route } from '../../utils';

/**
 * Send anonymous visitors home instead of letting them sit on a page that
 * cannot load.
 *
 * Every stage endpoint requires authentication, so rendering the view without a
 * session only produces a `401` and an error message that says nothing useful.
 * Login lives in a header dialog rather than on a route, so the way back is the
 * home page.
 *
 * @returns whether there is a session; callers should render nothing when false,
 *   since the redirect happens on the next effect and the view would otherwise
 *   fire a request it cannot complete.
 */
export function useRequireSession(): boolean {
  const { userState } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(userState?.token);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(Route.ROOT);
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn;
}
