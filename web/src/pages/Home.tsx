import { useState, useEffect } from 'react';
import { fetchTodayMeetings, deleteMeeting, fetchAccounts } from '../services/api';
import type { Meeting } from '../types';
import { useNavigate } from 'react-router-dom';
import { Video, ChevronRight, Trash2, UserCircle, Eye } from 'lucide-react';

const Home = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
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

    const filteredMeetings = meetings.filter(m =>
        selectedAccountId === 'all' || m.accountId?.toString() === selectedAccountId
    );

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
                {accounts.length > 0 && (
                    <div className="account-pill-selector">
                        <UserCircle size={16} />
                        <select
                            className="pill-select"
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                        >
                            <option value="all">All Accounts</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.email}</option>
                            ))}
                        </select>
                    </div>
                )}
            </header>

            <div className="timeline-flow">
                {filteredMeetings.length === 0 && (
                    <div className="empty-state-v2">
                        <Video size={40} className="empty-icon" />
                        <h2>No meetings found</h2>
                        <p>{selectedAccountId === 'all' ? 'Your schedule looks clear.' : 'No meetings for this account today.'}</p>
                        <button className="refresh-btn" onClick={loadData}>Refresh</button>
                    </div>
                )}

                {filteredMeetings.map((meeting) => {
                    const status = getTimeStatus(meeting.startTime);
                    const vipNames = meeting.VIPAlerts?.filter(a => a.status === 'active').map(a => a.vipName) || [];
                    const isTracked = vipNames.length > 0;

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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <h3>{meeting.title}</h3>
                                            {isTracked && <Eye size={16} className="tracked-icon" style={{ color: 'var(--primary)' }} />}
                                        </div>
                                        <div className="event-ops">
                                            <button className="event-op-btn danger" onClick={(e) => handleDelete(e, meeting.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="event-meta">
                                        <span className={`platform-tag-v2 ${meeting.platform}`}>{meeting.platform}</span>
                                        <span className="meta-separator">•</span>
                                        <span className="p-count">{meeting.participants?.length || 0} participants</span>
                                        {accounts.length > 1 && (
                                            <>
                                                <span className="meta-separator">•</span>
                                                <span className="account-tag">{accounts.find(a => a.id === meeting.accountId)?.email}</span>
                                            </>
                                        )}
                                    </div>

                                    {isTracked && (
                                        <div className="monitoring-indicator">
                                            <span className="monitoring-label">Tracking:</span>
                                            <span className="monitoring-names">{vipNames.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="event-action-area">
                                    <ChevronRight size={16} className="event-chevron" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
