// a utility function to manage session storage for anonymous users
export const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('anonymous_session_id');
    // If sessionId is missing or too old (e.g., older than 1 day), generate a new one
    const now = Date.now();
    let sessionTimestamp = localStorage.getItem('anonymous_session_timestamp');
    if (!sessionId || !sessionTimestamp || now - parseInt(sessionTimestamp, 10) > 24 * 60 * 60 * 1000) {
        // Generate a new session ID with more randomness and time precision
        sessionId = `session_${now}_${Math.random().toString(36).slice(2)}_${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;
        localStorage.setItem('anonymous_session_id', sessionId);
        localStorage.setItem('anonymous_session_timestamp', now.toString());
    }
    return sessionId;
};


// attempt 1: failure
// reason: Session ID is not unique enough (it persists across browser restarts and users, causing collisions).
// export const getOrCreateSessionId = () => {
//     let sessionId = localStorage.getItem('anonymous_session_id');
//     if (!sessionId) {
//         // we care about today, anything after a day is a new session
//         sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2);
//         localStorage.setItem('anonymous_session_id', sessionId);
//     }
//     return sessionId;
// };