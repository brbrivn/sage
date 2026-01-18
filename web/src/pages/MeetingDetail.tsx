import { useLocation, useNavigate } from 'react-router-dom';
import type { Meeting } from '../types';
import { createVIPAlert } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const MeetingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [meeting] = useState<Meeting | null>(location.state?.meeting || null);

    // Map of VIP Name to Alert ID for easy deletion
    const [activeAlerts, setActiveAlerts] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        if (location.state?.meeting?.VIPAlerts) {
            location.state.meeting.VIPAlerts.forEach((alert: any) => {
                if (alert.status === 'active') initial[alert.vipName] = alert.id;
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
            if (diff <= 0) { setTimeLeft('Started'); return; }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            if (hours > 0) { setTimeLeft(`in ${hours}h ${minutes}m`); } else { setTimeLeft(`in ${minutes}m`); }
        }, 1000);
        return () => clearInterval(timer);
    }, [meeting]);

    if (!meeting) return <div>No meeting selected</div>;

    const participants = meeting.participants || [];

    // Toggle monitor state
    const toggleMonitor = async (name: string) => {
        const alertId = activeAlerts[name];

        if (alertId) {
            // Turn off
            try {
                const { deleteVIPAlert } = await import('../services/api');
                await deleteVIPAlert(alertId);
                const newAlerts = { ...activeAlerts };
                delete newAlerts[name];
                setActiveAlerts(newAlerts);
            } catch (error) {
                console.error(error);
            }
        } else {
            // Turn on
            try {
                const response = await createVIPAlert(meeting.id, name);
                setActiveAlerts(prev => ({ ...prev, [name]: response.id }));

                if (Notification.permission === 'granted') {
                    new Notification('Sage Alert Set', {
                        body: `We will notify you when ${name} joins.`
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (

        <div className="home-container"> {/* Reusing home container for centering/width */}
            <header className="meeting-header" style={{ marginBottom: 32 }}>
                <button onClick={() => navigate(-1)} className="event-op-btn" style={{ marginBottom: 16 }}>
                    <ArrowLeft size={18} />
                </button>

                <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 8px 0' }}>{meeting.title}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-sec)' }}>
                    <span className={timeLeft === 'Started' ? 'status-live' : 'status-soon'}>{timeLeft === 'Started' ? 'Live Now' : timeLeft}</span>
                    <span>•</span>
                    <span style={{ textTransform: 'capitalize' }}>{meeting.platform}</span>
                </div>

                {timeLeft === 'Started' && meeting.meetingUrl && (
                    <a href={meeting.meetingUrl} target="_blank" rel="noreferrer" className="primary-btn" style={{ marginTop: 24, display: 'inline-flex', textDecoration: 'none' }}>
                        Join Meeting Now
                    </a>
                )}
            </header>

            <div className="detail-section">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Participant Tracking</h3>
                    <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>{participants.length} invitees</span>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 24 }}>
                    Select a participant to be notified when they join.
                </p>

                <div className="accounts-list">
                    {participants.length === 0 && (
                        <div className="empty-state-v2">
                            <p>No invitees found for this event.</p>
                        </div>
                    )}

                    {participants.map((p) => {
                        const isMonitored = !!activeAlerts[p];
                        return (
                            <div
                                key={p}
                                className="account-item"
                                onClick={() => toggleMonitor(p)}
                                style={{
                                    cursor: 'pointer',
                                    borderColor: isMonitored ? 'var(--primary)' : 'var(--border)',
                                    background: isMonitored ? 'var(--primary-faded)' : 'var(--card-bg)'
                                }}
                            >
                                <div className="log-icon" style={{
                                    background: isMonitored ? 'var(--primary)' : 'var(--hover)',
                                    color: isMonitored ? '#fff' : 'var(--text-sec)'
                                }}>
                                    {p.charAt(0).toUpperCase()}
                                </div>
                                <div className="account-details" style={{ flex: 1 }}>
                                    <span className="account-email" style={{ color: isMonitored ? 'var(--primary)' : 'var(--text)' }}>
                                        {p}
                                    </span>
                                    {isMonitored && (
                                        <span className="account-status" style={{ color: 'var(--primary)', marginTop: 2 }}>
                                            Tracking Active
                                        </span>
                                    )}
                                </div>
                                {isMonitored ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <button
                                            className="secondary-btn"
                                            style={{ padding: '4px 8px', fontSize: 11, height: 'auto' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                import('../services/api').then(({ api }) => {
                                                    api.post('/webhooks/simulate', {
                                                        meetingId: meeting.meetingId,
                                                        participantName: p
                                                    }).then(res => {
                                                        if (res.data.status === 'success' && res.data.matches.length > 0) {
                                                            alert(`Simulation sent! Check notifications.`);
                                                        } else {
                                                            alert('Simulation sent but no match found. Check server logs.');
                                                        }
                                                    });
                                                });
                                            }}
                                        >
                                            Test
                                        </button>
                                        <div style={{ color: 'var(--primary)' }}>
                                            ✓
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ opacity: 0.3 }}>
                                        +
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {Object.keys(activeAlerts).length > 0 && (
                <div className="info-box" style={{ marginTop: 32, padding: 16, background: 'var(--hover)', borderRadius: 8 }}>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-sec)' }}>
                        ℹ️ You will receive a <strong>push notification</strong> on this device when selected participants join.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MeetingDetail;
