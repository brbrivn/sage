import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendCallAlert = async (to: string, message: string) => {
    try {
        if (!accountSid || !authToken) {
            console.log('Mocking Twilio Call:', { to, message });
            return;
        }

        await client.calls.create({
            twiml: `<Response><Say>${message}</Say></Response>`,
            to,
            from: process.env.TWILIO_PHONE_NUMBER || '+1234567890'
        });
    } catch (error) {
        console.error('Twilio Call Error:', error);
    }
}

export const sendSmsAlert = async (to: string, message: string) => {
    try {
        if (!accountSid || !authToken) {
            console.log('Mocking Twilio SMS:', { to, message });
            return;
        }

        await client.messages.create({
            body: message,
            to,
            from: process.env.TWILIO_PHONE_NUMBER || '+1234567890'
        });
    } catch (error) {
        console.error('Twilio SMS Error:', error);
    }
}
