// a utility function to manage session storage for anonymous users
export const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('anonymous_session_id');
    // If sessionId is missing or too old, generate a new one
    // Expire after 20 minutes (600,000 ms)
    const EXPIRATION_MS = 20 * 60 * 1000;
    const now = Date.now();
    let sessionTimestamp = localStorage.getItem('anonymous_session_timestamp');
    if (!sessionId || !sessionTimestamp || now - parseInt(sessionTimestamp, 10) > EXPIRATION_MS) {
        // Generate a new session ID with more randomness and time precision
        sessionId = `session_${now}_${Math.random().toString(36).slice(2)}_${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;
        localStorage.setItem('anonymous_session_id', sessionId);
        localStorage.setItem('anonymous_session_timestamp', now.toString());
    }
    return sessionId;
};
