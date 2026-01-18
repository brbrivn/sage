import { useEffect, useState } from 'react';
import api from '../services/api';
import { Bell, CheckCircle, XCircle, Mail, Monitor } from 'lucide-react';

interface Activity {
    id: number;
    vipName: string;
    type: 'desktop' | 'email' | 'call';
    status: 'sent' | 'failed';
    message: string;
    createdAt: string;
    Meeting?: { title: string };
}

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivityPanelProps {
    isOpen: boolean;
    onToggle: () => void;
}

const ActivityPanel = ({ isOpen, onToggle }: ActivityPanelProps) => {
    const [activities, setActivities] = useState<Activity[]>([]);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/activities');
            setActivities(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 30000); // Polling every 30s

        window.addEventListener('activity-update', fetchLogs);

        return () => {
            clearInterval(interval);
            window.removeEventListener('activity-update', fetchLogs);
        };
    }, []);

    if (!isOpen) {
        return (
            <aside className="right-panel collapsed">
                <button className="panel-toggle-btn" onClick={onToggle}>
                    <ChevronLeft size={16} />
                </button>
            </aside>
        );
    }

    return (
        <aside className="right-panel">
            <div className="panel-header">
                <button className="panel-toggle-btn" onClick={onToggle} style={{ marginRight: 8 }}>
                    <ChevronRight size={16} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <Bell size={18} />
                    <h3>Activity Log</h3>
                </div>
                <button className="icon-btn-text" onClick={async () => {
                    await api.post('/activities/mock', { vipName: 'Brian', type: 'desktop' });
                    fetchLogs();
                }} title="Simulate Alert">
                    <CheckCircle size={16} />
                </button>
            </div>

            <div className="activity-list">
                {activities.length === 0 && <p className="empty-state">No recent activity.</p>}

                {activities.map((log) => (
                    <div key={log.id} className="log-item">
                        <div className="log-icon">
                            {log.type === 'email' ? <Mail size={14} /> : <Monitor size={14} />}
                        </div>
                        <div className="log-content">
                            <p className="log-msg"><strong>{log.vipName}</strong> joined</p>
                            <small className="log-meeting">{log.Meeting?.title}</small>
                            <div className="log-footer">
                                <span className={`log-status ${log.status}`}>
                                    {log.status === 'sent' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                    {log.status === 'sent' ? 'Notified' : 'Failed'}
                                </span>
                                <span className="log-time">
                                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default ActivityPanel;
