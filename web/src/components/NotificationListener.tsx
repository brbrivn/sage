import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const NotificationListener = () => {
    const navigate = useNavigate();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('sage_token');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id;

            console.log('[Socket] Initializing browser connection for user:', userId);

            const socket = io('http://localhost:5001', {
                transports: ['websocket', 'polling'], // Allow polling for robustness
                reconnection: true,
                timeout: 10000
            });

            socketRef.current = socket;

            socket.on('connect', () => {
                console.log('[Socket] ✅ Connected to Sage Server');
                socket.emit('join', userId);
            });

            socket.on('notification', (data: { title: string, body: string, meetingId: number }) => {
                console.log('[Socket] 🔔 Notification:', data);

                // standard web notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    const n = new Notification(data.title, {
                        body: data.body,
                        tag: 'sage-notification-' + data.meetingId // Avoid stacking
                    });

                    n.onclick = () => {
                        window.focus();
                        navigate(`/meeting/${data.meetingId}`);
                    };
                } else {
                    console.log('[Socket] Notification blocked (no permission)');
                }
            });

            return () => {
                console.log('[Socket] Disconnecting...');
                socket.disconnect();
            };
        } catch (e) {
            console.error('[Socket] Setup error:', e);
        }
    }, [navigate]);

    return null;
};

export default NotificationListener;
