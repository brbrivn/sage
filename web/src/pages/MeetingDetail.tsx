import { useLocation, useNavigate } from 'react-router-dom';
import type { Meeting } from '../types';
import { createVIPAlert } from '../services/api';
import { ArrowLeft } from 'lucide-react';
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
        <div className="settings-container">
            <header className="settings-header">
                <button onClick={() => navigate(-1)} className="event-op-btn" style={{ marginBottom: 12 }}>
                    <ArrowLeft size={18} />
                </button>
                <h1>{meeting.title}</h1>
                <p>Monitor arrivals for this meeting.</p>
            </header>

            <div className="settings-group">
                <div className="group-title">Timing & Status</div>
                <div className="settings-row">
                    <div className="row-info">
                        <label>Auto-Monitoring Status</label>
                        <span>Tracking arrivals {timeLeft}</span>
                    </div>
                    <div className={timeLeft === 'Started' ? 'status-live' : 'status-soon'} style={{ fontSize: 13, fontWeight: 600 }}>
                        {timeLeft}
                    </div>
                </div>
            </div>

            <div className="settings-group">
                <div className="group-title">Participants ({participants.length})</div>
                <div className="accounts-list">
                    {participants.length === 0 && (
                        <div className="empty-state-v2">
                            <p>No invitees found for this event.</p>
                        </div>
                    )}

                    {participants.map((p) => (
                        <div key={p} className="account-item">
                            <div className="log-icon" style={{ background: selectedVIPs.has(p) ? 'var(--primary-faded)' : 'var(--hover)', color: selectedVIPs.has(p) ? 'var(--primary)' : 'var(--text-sec)' }}>
                                {p.charAt(0).toUpperCase()}
                            </div>
                            <div className="account-details" style={{ flex: 1 }}>
                                <span className="account-email">{p}</span>
                                {selectedVIPs.has(p) && <span className="account-status">Monitoring VIP</span>}
                            </div>
                            <label className="switch">
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
        </div>
    );
};

export default MeetingDetail;
