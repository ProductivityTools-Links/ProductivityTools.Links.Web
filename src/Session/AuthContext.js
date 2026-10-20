import { createContext, useEffect, useContext, useState, useCallback } from 'react';
import { isJwtExpired } from 'jwt-check-expiration';
import { auth } from './firebase';
import statusService from '../services/statusService';

const AuthContext = createContext({
    user: null
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [tokenRefreshTime, setTokenRefreshTime] = useState(() => {
        const stored = localStorage.getItem('tokenRefreshTime');
        return stored ? new Date(stored) : null;
    });

    const refreshToken = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const token = await currentUser.getIdToken(true);
            const now = new Date();
            localStorage.setItem('token', token);
            localStorage.setItem('tokenRefreshTime', now.toISOString());
            setTokenRefreshTime(now);
            return token;
        }
        return null;
    }, []);

    useEffect(() => {
        return auth.onIdTokenChanged(async (firebaseUser) => {
            if (!firebaseUser) {
                console.log('missing user');
                setUser(null);
                setTokenRefreshTime(null);
                localStorage.removeItem('token');
                localStorage.removeItem('tokenRefreshTime');
            } else {
                setUser(firebaseUser);
                const token = await firebaseUser.getIdToken();
                let expired = false;
                try {
                    expired = isJwtExpired(token);
                } catch (e) {
                    expired = true;
                }

                if (expired) {
                    await refreshToken();
                } else {
                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', firebaseUser.refreshToken);
                    const tokenResult = await firebaseUser.getIdTokenResult();
                    const issuedAt = tokenResult?.claims?.iat
                        ? new Date(tokenResult.claims.iat * 1000)
                        : new Date();
                    localStorage.setItem('tokenRefreshTime', issuedAt.toISOString());
                    setTokenRefreshTime(issuedAt);
                    statusService.info('Session token saved in local storage');
                }
            }
        });
    }, [refreshToken]);

    useEffect(() => {
        const minutes = 4;
        const interval = minutes * 60 * 1000;

        const handle = setInterval(async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                console.log('Auth Context, setInterval invoked, getIdToken on user performed');
                statusService.info(`${minutes} min passed — refreshing session token`);
                await refreshToken();
                statusService.success('Session token refreshed');
            }
        }, interval);
        return () => clearInterval(handle);
    }, [refreshToken]);

    return (
        <AuthContext.Provider value={{ user, tokenRefreshTime, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
