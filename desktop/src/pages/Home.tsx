import { useEffect, useState } from 'react';
import { fetchTodayMeetings } from '../services/api';
import type { Meeting } from '../types';
import { useNavigate } from 'react-router-dom';
import { Video, Clock, ChevronRight } from 'lucide-react';

const Home = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTodayMeetings();
                setMeetings(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        load();

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getTimeStatus = (startTime: string) => {
        const start = new Date(startTime);
        const diff = start.getTime() - currentTime.getTime();

        if (diff <= 0) return { label: 'Started', class: 'status-live' };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) return { label: `${hours}h ${mins}m`, class: 'status-upcoming' };
        return { label: `${mins}m`, class: 'status-soon' };
    };

    if (loading) return <div className="p-8">Loading timeline...</div>;

    return (
        <div className="container">
            <header className="header">
                <div>
                    <h2>Timeline</h2>
                    <p className="subtitle">Your schedule for {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
            </header>

            <div className="timeline">
                {meetings.length === 0 && (
                    <div className="empty-state">
                        <Video size={48} className="icon-sec" />
                        <p>No meetings found for today.</p>
                        <button onClick={() => window.location.reload()}>Refresh Calendar</button>
                    </div>
                )}

                {meetings.map((meeting, index) => {
                    const status = getTimeStatus(meeting.startTime);
                    const isLast = index === meetings.length - 1;

                    return (
                        <div key={meeting.id} className="timeline-item" onClick={() => navigate(`/meeting/${meeting.id}`, { state: { meeting } })}>
                            <div className="time-col">
                                <span className="time-main">
                                    {new Date(meeting.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                </span>
                                <div className={`time-badge ${status.class}`}>
                                    {status.label}
                                </div>
                                {!isLast && <div className="timeline-line"></div>}
                            </div>

                            <div className="timeline-card">
                                <div className="card-content">
                                    <div className="card-header">
                                        <h3>{meeting.title}</h3>
                                        <ChevronRight size={18} className="chevron" />
                                    </div>
                                    <div className="card-meta">
                                        <div className="meta-item">
                                            <Video size={14} />
                                            <span>{meeting.platform}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={14} />
                                            <span>{new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    {meeting.VIPAlerts && meeting.VIPAlerts.length > 0 && (
                                        <div className="monitored-pills">
                                            {meeting.VIPAlerts.map(alert => (
                                                <span key={alert.id} className="pill">Monitoring {alert.vipName}</span>
                                            ))}
                                        </div>
                                    )}
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
