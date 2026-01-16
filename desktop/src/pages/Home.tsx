import { useEffect, useState } from 'react';
import { fetchTodayMeetings } from '../services/api';
import type { Meeting } from '../types';
import { useNavigate } from 'react-router-dom';
import { Video, Clock } from 'lucide-react';

const Home = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
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
    }, []);

    const handleMeetingClick = (meeting: Meeting) => {
        // We pass state via react-router
        navigate(`/meeting/${meeting.id}`, { state: { meeting } });
    };

    if (loading) return <div className="p-8">Loading meetings...</div>;

    return (
        <div className="container">
            <header className="header">
                <h2>Today's Meetings</h2>
            </header>

            <div className="meeting-list">
                {meetings.length === 0 && <p className="empty-state">No meetings found.</p>}

                {meetings.map((meeting) => (
                    <div
                        key={meeting.id}
                        className="meeting-card"
                        onClick={() => handleMeetingClick(meeting)}
                    >
                        <div className="icon-box">
                            <Video className="icon-primary" size={24} />
                        </div>
                        <div className="info">
                            <h3>{meeting.title}</h3>
                            <div className="meta">
                                <Clock size={14} />
                                <span>{new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className="platform-tag">
                            {meeting.platform}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
