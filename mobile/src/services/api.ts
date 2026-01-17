import { getToken } from './auth';

const BASE_URL = 'http://localhost:5001/api';

export const fetchTodayMeetings = async () => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/meetings/today`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch meetings');
    }

    return response.json();
};


export const createVIPAlert = async (meetingId: number, vipName: string, vipEmail?: string) => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            meetingId,
            vipName,
            vipEmail
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create alert');
    }

    return response.json();
};
