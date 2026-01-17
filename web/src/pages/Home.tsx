import { useState, useEffect } from 'react';
import { fetchTodayMeetings, deleteMeeting, fetchAccounts } from '../services/api';
import type { Meeting } from '../types';
import { useNavigate } from 'react-router-dom';
import { Video, ChevronRight, Trash2, UserCircle, Bell } from 'lucide-react';

const Home = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            const meetingData = await fetchTodayMeetings();
            setMeetings(meetingData);
            const accountData = await fetchAccounts();
            setAccounts(accountData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (window.confirm('Remove this meeting from your list?')) {
            try {
                await deleteMeeting(id);
                setMeetings(prev => prev.filter(m => m.id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const getTimeStatus = (startTime: string) => {
        const start = new Date(startTime);
        const diff = start.getTime() - currentTime.getTime();

        if (diff <= 0) return { label: 'Live', class: 'status-live' };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) return { label: `In ${hours}h ${mins}m`, class: 'status-upcoming' };
        return { label: `In ${mins}m`, class: 'status-soon' };
    };

    if (loading) return <div className="loading-container">Scanning timeline...</div>;

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="title-area">
                    <h1>Timeline</h1>
                    <span className="date-display">{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                {accounts.length > 1 && (
                    <div className="account-pill-selector">
                        <UserCircle size={16} />
                        <select className="pill-select">
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.email}>{acc.email}</option>
                            ))}
                        </select>
                    </div>
                )}
            </header>

            <div className="timeline-flow">
                {meetings.length === 0 && (
                    <div className="empty-state-v2">
                        <Video size={40} className="empty-icon" />
                        <h2>No meetings today</h2>
                        <p>Your schedule looks clear. Check back later or refresh.</p>
                        <button className="refresh-btn" onClick={loadData}>Refresh</button>
                    </div>
                )}

                {meetings.map((meeting) => {
                    const status = getTimeStatus(meeting.startTime);

                    return (
                        <div key={meeting.id} className="event-row" onClick={() => navigate(`/meeting/${meeting.id}`, { state: { meeting } })}>
                            <div className="event-time">
                                <span className="time-value">
                                    {new Date(meeting.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}
                                </span>
                                <span className={`event-status ${status.class}`}>{status.label}</span>
                            </div>

                            <div className="event-card">
                                <div className="event-body">
                                    <div className="event-title-row">
                                        <h3>{meeting.title}</h3>
                                        <div className="event-ops">
                                            <button className="event-op-btn danger" onClick={(e) => handleDelete(e, meeting.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="event-meta">
                                        <span className="platform-tag-v2">{meeting.platform}</span>
                                        <span className="p-count">{meeting.participants?.length || 0} participants</span>
                                    </div>

                                    {meeting.VIPAlerts && meeting.VIPAlerts.length > 0 && (
                                        <div className="monitoring-indicator">
                                            <Bell size={10} />
                                            <span>Monitoring {meeting.VIPAlerts.length} {meeting.VIPAlerts.length === 1 ? 'person' : 'people'}</span>
                                        </div>
                                    )}
                                </div>
                                <ChevronRight size={16} className="event-chevron" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
