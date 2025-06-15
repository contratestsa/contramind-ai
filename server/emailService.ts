import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set. Email functionality will be disabled.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("Email not sent - SENDGRID_API_KEY not configured");
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function createWaitlistConfirmationEmail(fullName: string, email: string, language: 'ar' | 'en' = 'en') {
  const isArabic = language === 'ar';
  
  const subject = isArabic 
    ? 'تأكيد انضمامك لقائمة الانتظار - ContraMind'
    : 'Waitlist Confirmation - ContraMind';
    
  const textContent = isArabic 
    ? `مرحباً ${fullName},

شكراً لانضمامك إلى قائمة الانتظار لـ ContraMind - أول منصة قانونية للذكاء الاصطناعي لإدارة ومراجعة العقود باللغة العربية.

سنتواصل معك قريباً بمجرد إطلاق المنصة.

مع أطيب التحيات,
فريق ContraMind`
    : `Hello ${fullName},

Thank you for joining the ContraMind waitlist - The First Legal AI Platform for Contract Management and Review Supporting Arabic Language.

We'll be in touch soon when we launch the platform.

Best regards,
The ContraMind Team`;

  const htmlContent = isArabic 
    ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
      <div style="background-color: #0C2836; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">ContraMind</h1>
        <p style="margin: 10px 0 0 0; color: #B7DEE8;">أول منصة قانونية للذكاء الاصطناعي</p>
      </div>
      
      <div style="background-color: #E6E6E6; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #0C2836; margin-top: 0;">مرحباً ${fullName}!</h2>
        
        <p style="color: #333; line-height: 1.6;">
          شكراً لانضمامك إلى قائمة الانتظار لـ ContraMind - أول منصة قانونية للذكاء الاصطناعي لإدارة ومراجعة العقود باللغة العربية.
        </p>
        
        <p style="color: #333; line-height: 1.6;">
          سنتواصل معك قريباً بمجرد إطلاق المنصة وستحصل على:
        </p>
        
        <ul style="color: #333; line-height: 1.8;">
          <li>إشتراك مجاني لمدة 3 أشهر</li>
          <li>وصول مبكر للمنصة</li>
          <li>دعم فني مخصص</li>
        </ul>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #B7DEE8; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #0C2836; font-weight: bold;">ترقبوا إطلاق المنصة قريباً!</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          مع أطيب التحيات،<br>
          فريق ContraMind
        </p>
      </div>
    </div>
    `
    : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #0C2836; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">ContraMind</h1>
        <p style="margin: 10px 0 0 0; color: #B7DEE8;">The First Legal AI Platform Supporting Arabic</p>
      </div>
      
      <div style="background-color: #E6E6E6; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #0C2836; margin-top: 0;">Hello ${fullName}!</h2>
        
        <p style="color: #333; line-height: 1.6;">
          Thank you for joining the ContraMind waitlist - The First Legal AI Platform for Contract Management and Review Supporting Arabic Language.
        </p>
        
        <p style="color: #333; line-height: 1.6;">
          We'll be in touch soon when we launch the platform and you'll receive:
        </p>
        
        <ul style="color: #333; line-height: 1.8;">
          <li>3 months free subscription</li>
          <li>Early access to the platform</li>
          <li>Dedicated technical support</li>
        </ul>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #B7DEE8; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #0C2836; font-weight: bold;">Stay tuned for our launch!</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          The ContraMind Team
        </p>
      </div>
    </div>
    `;

  return {
    subject,
    text: textContent,
    html: htmlContent
  };
}