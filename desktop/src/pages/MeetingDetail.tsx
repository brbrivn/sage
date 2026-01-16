import { useLocation, useNavigate } from 'react-router-dom';
import type { Meeting } from '../types';
import { createVIPAlert } from '../services/api';
import { ArrowLeft, User, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const MeetingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const meeting = location.state?.meeting as Meeting;
    const [selectedVIP, setSelectedVIP] = useState<string | null>(null);

    if (!meeting) return <div>No meeting selected</div>;

    const participants = meeting.participants?.length > 0
        ? meeting.participants
        : ['Brian Chen', 'Sarah Jones', 'Alex Rivera', 'Sam Altman'];

    const handleSetAlert = async (name: string) => {
        if (window.confirm(`Notify when ${name} joins?`)) {
            try {
                await createVIPAlert(meeting.id, name);
                setSelectedVIP(name);
                // Trigger native notification
                new Notification('Sage Alert Set', {
                    body: `We will notify you when ${name} joins.`
                });
            } catch (error) {
                alert('Failed to set alert');
            }
        }
    };

    return (
        <div className="container">
            <header className="header with-back">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h2>Select VIP</h2>
            </header>

            <div className="meeting-header">
                <h3>{meeting.title}</h3>
                <p>Who specific are you waiting for?</p>
            </div>

            <div className="participant-list">
                {participants.map((p) => (
                    <div
                        key={p}
                        className={`participant-card ${selectedVIP === p ? 'selected' : ''}`}
                        onClick={() => handleSetAlert(p)}
                    >
                        <div className="avatar">
                            <User size={20} />
                        </div>
                        <span className="name">{p}</span>
                        {selectedVIP === p && <CheckCircle className="check" size={20} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingDetail;
