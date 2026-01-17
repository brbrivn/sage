export interface User {
    id: number;
    email: string;
    googleToken?: string;
}

export interface Meeting {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    platform: 'zoom' | 'meet' | 'teams' | 'other';
    meetingUrl: string;
    participants: string[];
    VIPAlerts?: VIPAlert[];
}

export interface VIPAlert {
    id: number;
    vipName: string;
    status: 'active' | 'triggered' | 'cancelled';
}
