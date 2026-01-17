import { useLocation, useNavigate } from 'react-router-dom';
import type { Meeting } from '../types';
import { createVIPAlert } from '../services/api';
import { ArrowLeft, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const MeetingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState<Meeting | null>(location.state?.meeting || null);

    // Use a Set for multiple selection. 
    // Init from existing active alerts if available (requires backend to send this, see step 1)
    const [selectedVIPs, setSelectedVIPs] = useState<Set<string>>(() => {
        const initial = new Set<string>();
        if (location.state?.meeting?.VIPAlerts) {
            location.state.meeting.VIPAlerts.forEach((alert: any) => {
                if (alert.status === 'active') initial.add(alert.vipName);
            });
        }
        return initial;
    });

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!meeting) return;

        const timer = setInterval(() => {
            const now = new Date();
            const start = new Date(meeting.startTime);
            const diff = start.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('Started');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                setTimeLeft(`in ${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`in ${minutes}m`);
            }
        }, 1000); // Update every minute is enough? No, seconds for smooth feel maybe, but UI shows minutes.

        return () => clearInterval(timer);
    }, [meeting]);

    if (!meeting) return <div>No meeting selected</div>;

    const participants = meeting.participants || [];

    // Toggle monitor state
    const toggleMonitor = async (name: string) => {
        const newSet = new Set(selectedVIPs);

        if (newSet.has(name)) {
            // Turn off
            newSet.delete(name);
            // In real app: call DELETE /api/alerts/:id
        } else {
            // Turn on
            newSet.add(name);
            try {
                // If switching, creating a new alert (in MVP we just overwrite)
                await createVIPAlert(meeting.id, name);
                new Notification('Sage Alert Set', {
                    body: `We will notify you when ${name} joins.`
                });
            } catch (error) {
                console.error(error);
            }
        }
        setSelectedVIPs(newSet);
    };

    return (
        <div className="container">
            <header className="header with-back">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h2>Event Details</h2>
            </header>

            <div className="meeting-header">
                <div>
                    <h3>{meeting.title}</h3>
                    <div className="meta big-meta">
                        <Clock size={16} />
                        <span className={timeLeft === 'Started' ? 'text-green' : 'text-blue'}>
                            {timeLeft || 'Loading...'}
                        </span>
                    </div>
                </div>
                <p>Who do you want to monitor?</p>
            </div>

            <div className="participant-list">
                {participants.length === 0 && (
                    <div className="empty-state">
                        <p>No invitees found via Google Calendar.</p>
                        <p style={{ fontSize: 12, opacity: 0.7 }}>Ensure the event has guests invited.</p>
                    </div>
                )}

                {participants.map((p) => (
                    <div
                        key={p}
                        className={`participant-card ${selectedVIPs.has(p) ? 'selected' : ''}`}
                    >
                        <div className="avatar">
                            {/* Initials avatar logic */}
                            {p.charAt(0).toUpperCase()}
                        </div>
                        <span className="name" style={{ flex: 1 }}>{p}</span>

                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={selectedVIPs.has(p)}
                                onChange={() => toggleMonitor(p)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingDetail;
