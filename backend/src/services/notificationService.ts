import nodemailer from 'nodemailer';
import ActivityLog from '../models/ActivityLog';
import User from '../models/User';
import Meeting from '../models/Meeting';
import VIPAlert from '../models/VIPAlert';
import { sendCallAlert } from './twilioService';

// Email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Socket.io instance will be attached here
let io: any = null;

export const setIo = (socketIoInstance: any) => {
    io = socketIoInstance;
};

export const triggerNotification = async (alert: VIPAlert, meeting: Meeting) => {
    try {
        const user = await User.findByPk(alert.userId);
        if (!user) return;

        console.log(`Triggering ${alert.notificationMethod} alert for ${user.email}`);

        let status: 'sent' | 'failed' = 'sent';
        let message = `${alert.vipName} has joined "${meeting.title}"`;

        switch (alert.notificationMethod) {
            case 'call':
                if (user.phoneNumber) {
                    await sendCallAlert(user.phoneNumber, `${message}. Press 1 to join.`);
                }
                break;

            case 'email':
                await transporter.sendMail({
                    from: '"Sage Alerts" <alerts@sage.app>',
                    to: user.email,
                    subject: `🚨 VIP Join Alert: ${alert.vipName}`,
                    text: `${message}. Platform: ${meeting.platform}. Link: ${meeting.meetingUrl}`,
                    html: `<p>${message}</p><p>Platform: <b>${meeting.platform}</b></p><p><a href="${meeting.meetingUrl}">Join Meeting Now</a></p>`
                });
                break;

            case 'desktop':
                // Send via Socket.io to the desktop app
                if (io) {
                    io.to(`user_${user.id}`).emit('notification', {
                        title: 'VIP Joined!',
                        body: message,
                        meetingId: meeting.id
                    });
                }
                break;

            default:
                console.log('No specific notification method handled for:', alert.notificationMethod);
        }

        // Create Activity Log
        // Casting as any to avoid enum mismatch lint if necessary, though types should align
        await ActivityLog.create({
            userId: user.id,
            meetingId: meeting.id,
            vipName: alert.vipName,
            type: (alert.notificationMethod as any),
            status,
            message: `Notified via ${alert.notificationMethod}: ${alert.vipName} joined.`
        });

        // Mark alert as triggered so we don't spam
        alert.status = 'triggered';
        await alert.save();

    } catch (error) {
        console.error('Error triggering notification:', error);

        // Log failure
        await ActivityLog.create({
            userId: alert.userId,
            meetingId: meeting.id,
            vipName: alert.vipName,
            type: (alert.notificationMethod as any),
            status: 'failed',
            message: `Failed to notify via ${alert.notificationMethod}.`
        });
    }
};
