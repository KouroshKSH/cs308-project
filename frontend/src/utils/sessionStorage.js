// a utility function to manage session storage for anonymous users
export const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('anonymous_session_id');
    if (!sessionId) {
        // we care about today, anything after a day is a new session
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        localStorage.setItem('anonymous_session_id', sessionId);
    }
    return sessionId;
};