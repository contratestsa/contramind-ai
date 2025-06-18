import { Resend } from 'resend';

// Initialize Resend with API key
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_Uenah5Xh_4JuS15Szx9VW72LizxVNqbVe';
const resend = new Resend(RESEND_API_KEY);

interface EmailData {
  email: string;
  fullName: string;
  waitlistPosition: number;
}

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendWelcomeEmail({ email, fullName, waitlistPosition }: EmailData) {
  const subject = `Welcome to ContraMind - You're #${waitlistPosition} on the waitlist`;
  const htmlContent = getEnglishEmailTemplate(fullName, waitlistPosition);
  const textContent = getEnglishTextTemplate(fullName, waitlistPosition);

  // Try with custom domain first, fallback to default domain
  const fromAddresses = [
    'ContraMind Team <noreply@contramind.ai>',
    'ContraMind Team <onboarding@resend.dev>'
  ];

  for (const fromAddress of fromAddresses) {
    try {
      const data = await resend.emails.send({
        from: fromAddress,
        to: [email],
        subject,
        html: htmlContent,
        text: textContent,
      });

      console.log(`Email sent successfully from ${fromAddress}:`, data);
      return { success: true, data };
    } catch (error) {
      console.log(`Failed to send from ${fromAddress}:`, error);
      continue;
    }
  }

  console.error('All email attempts failed');
  return { success: false, error: 'Unable to send email from any configured domain' };
}

function getEnglishEmailTemplate(fullName: string, waitlistPosition: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ContraMind</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0C2836 0%, #1a3a4a 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                ContraMind
            </h1>
            <p style="color: #B7DEE8; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                AI-Powered Legal Technology Platform
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #0C2836; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                Welcome to the Future of Legal Technology!
            </h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${fullName},
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for joining the ContraMind waitlist! We're excited to have you on board as we prepare to revolutionize legal contract management in the MENA region.
            </p>

            <!-- Waitlist Position -->
            <div style="background-color: #f0f9ff; border-left: 4px solid #B7DEE8; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #0C2836; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                    Your Waitlist Position
                </h3>
                <p style="color: #0C2836; font-size: 24px; font-weight: 700; margin: 0;">
                    #${waitlistPosition}
                </p>
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
                    You'll be among the first to experience ContraMind when we launch!
                </p>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                <strong>What to expect:</strong>
            </p>
            
            <ul style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 20px;">
                <li style="margin-bottom: 8px;">Early access to our AI-powered contract analysis platform</li>
                <li style="margin-bottom: 8px;">Bilingual support in Arabic and English</li>
                <li style="margin-bottom: 8px;">Advanced risk assessment and legal review tools</li>
                <li style="margin-bottom: 8px;">Exclusive updates on our launch progress</li>
            </ul>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We'll keep you updated on our progress and notify you as soon as ContraMind is ready for launch.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://contramind.ai" style="background: linear-gradient(135deg, #0C2836 0%, #1a3a4a 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(12, 40, 54, 0.3);">
                    Visit ContraMind.ai
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Thank you for your interest in ContraMind
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This email was sent because you joined our waitlist at contramind.ai
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

function getEnglishTextTemplate(fullName: string, waitlistPosition: number): string {
  return `
Welcome to ContraMind!

Dear ${fullName},

Thank you for joining the ContraMind waitlist! We're excited to have you on board as we prepare to revolutionize legal contract management in the MENA region.

Your Waitlist Position: #${waitlistPosition}

You'll be among the first to experience ContraMind when we launch!

What to expect:
- Early access to our AI-powered contract analysis platform
- Bilingual support in Arabic and English
- Advanced risk assessment and legal review tools
- Exclusive updates on our launch progress

We'll keep you updated on our progress and notify you as soon as ContraMind is ready for launch.

Visit us at: https://contramind.ai

Thank you for your interest in ContraMind.

---
This email was sent because you joined our waitlist at contramind.ai
  `;
}

export async function sendContactEmail({ name, email, subject, message }: ContactEmailData) {
  // Send email to ContraMind team
  const toTeamEmail = await resend.emails.send({
    from: 'ContraMind Team <noreply@contramind.ai>',
    to: ['ceo@contramind.com'],
    subject: `Contact Form: ${subject}`,
    html: getContactEmailTemplate(name, email, subject, message),
    text: getContactTextTemplate(name, email, subject, message),
  });

  // Send confirmation email to user
  const toUserEmail = await resend.emails.send({
    from: 'ContraMind Team <noreply@contramind.ai>',
    to: [email],
    subject: 'Message Received - ContraMind Team',
    html: getContactConfirmationTemplate(name),
    text: getContactConfirmationTextTemplate(name),
  });

  return { toTeamEmail, toUserEmail };
}

function getContactEmailTemplate(name: string, email: string, subject: string, message: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contact Form Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0C2836 0%, #1a3a4a 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                New Contact Message
            </h1>
        </div>
        <div style="padding: 40px 30px;">
            <h2 style="color: #0C2836; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                Contact Details
            </h2>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; color: #374151;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0; color: #374151;"><strong>Subject:</strong> ${subject}</p>
            </div>
            <h3 style="color: #0C2836; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                Message
            </h3>
            <div style="background-color: #f0f9ff; border-left: 4px solid #B7DEE8; padding: 20px; border-radius: 0 8px 8px 0;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

function getContactTextTemplate(name: string, email: string, subject: string, message: string): string {
  return `
New Contact Message - ContraMind

Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from ContraMind Contact Form
  `;
}

function getContactConfirmationTemplate(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Message Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0C2836 0%, #1a3a4a 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                Message Received
            </h1>
        </div>
        <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${name},
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for contacting ContraMind. We have received your message and will get back to you within 24 hours.
            </p>
            <div style="background-color: #f0f9ff; border-left: 4px solid #B7DEE8; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #0C2836; font-size: 16px; margin: 0;">
                    <strong>Our team is committed to providing you with the best support for your legal technology needs.</strong>
                </p>
            </div>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Best regards,<br>
                The ContraMind Team
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

function getContactConfirmationTextTemplate(name: string): string {
  return `
Message Received - ContraMind

Dear ${name},

Thank you for contacting ContraMind. We have received your message and will get back to you within 24 hours.

Our team is committed to providing you with the best support for your legal technology needs.

Best regards,
The ContraMind Team

---
ContraMind.ai - AI-Powered Legal Contract Management
  `;
}