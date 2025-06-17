import { Resend } from 'resend';

// Initialize Resend with API key
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_Uenah5Xh_4JuS15Szx9VW72LizxVNqbVe';
const resend = new Resend(RESEND_API_KEY);

interface EmailData {
  email: string;
  fullName: string;
  language: 'ar' | 'en';
  waitlistPosition: number;
}

export async function sendWelcomeEmail({ email, fullName, language, waitlistPosition }: EmailData) {
  const isArabic = language === 'ar';
  
  // Email content in both languages
  const subject = isArabic 
    ? `مرحباً بك في ContraMind - موضعك في قائمة الانتظار #${waitlistPosition}`
    : `Welcome to ContraMind - You're #${waitlistPosition} on the waitlist`;

  const htmlContent = isArabic ? getArabicEmailTemplate(fullName, waitlistPosition) : getEnglishEmailTemplate(fullName, waitlistPosition);
  const textContent = isArabic ? getArabicTextTemplate(fullName, waitlistPosition) : getEnglishTextTemplate(fullName, waitlistPosition);

  try {
    const data = await resend.emails.send({
      from: 'ContraMind Team <onboarding@resend.dev>',
      to: [email],
      subject,
      html: htmlContent,
      text: textContent,
    });

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
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

function getArabicEmailTemplate(fullName: string, waitlistPosition: number): string {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مرحباً بك في ContraMind</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Almarai', Arial, sans-serif; background-color: #f8fafc; direction: rtl;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0C2836 0%, #1a3a4a 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                ContraMind
            </h1>
            <p style="color: #B7DEE8; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                منصة التكنولوجيا القانونية المدعومة بالذكاء الاصطناعي
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #0C2836; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                مرحباً بك في مستقبل التكنولوجيا القانونية!
            </h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                عزيزي ${fullName}،
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                شكراً لك لانضمامك إلى قائمة انتظار ContraMind! نحن متحمسون لوجودك معنا بينما نستعد لثورة في إدارة العقود القانونية في منطقة الشرق الأوسط وشمال أفريقيا.
            </p>

            <!-- Waitlist Position -->
            <div style="background-color: #f0f9ff; border-right: 4px solid #B7DEE8; padding: 20px; margin: 30px 0; border-radius: 8px 0 0 8px;">
                <h3 style="color: #0C2836; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                    موضعك في قائمة الانتظار
                </h3>
                <p style="color: #0C2836; font-size: 24px; font-weight: 700; margin: 0;">
                    #${waitlistPosition}
                </p>
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
                    ستكون من بين الأوائل الذين سيختبرون ContraMind عند الإطلاق!
                </p>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                <strong>ما يمكنك توقعه:</strong>
            </p>
            
            <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 30px 20px; text-align: right;">
                <li style="margin-bottom: 12px;">الوصول المبكر لمنصة تحليل العقود المدعومة بالذكاء الاصطناعي</li>
                <li style="margin-bottom: 12px;">دعم ثنائي اللغة بالعربية والإنجليزية</li>
                <li style="margin-bottom: 12px;">أدوات متقدمة لتقييم المخاطر والمراجعة القانونية</li>
                <li style="margin-bottom: 12px;">تحديثات حصرية حول تقدم الإطلاق</li>
            </ul>

            <p style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
                سنواصل إطلاعك على تقدمنا وإشعارك بمجرد أن تصبح ContraMind جاهزة للإطلاق.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://contramind.ai" style="background: linear-gradient(135deg, #0C2836 0%, #1a3a4a 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(12, 40, 54, 0.3);">
                    زيارة ContraMind.ai
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                شكراً لك لاهتمامك بـ ContraMind
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                تم إرسال هذا البريد الإلكتروني لأنك انضممت إلى قائمة الانتظار في contramind.ai
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

function getArabicTextTemplate(fullName: string, waitlistPosition: number): string {
  return `
مرحباً بك في ContraMind!

عزيزي ${fullName}،

شكراً لك لانضمامك إلى قائمة انتظار ContraMind! نحن متحمسون لوجودك معنا بينما نستعد لثورة في إدارة العقود القانونية في منطقة الشرق الأوسط وشمال أفريقيا.

موضعك في قائمة الانتظار: #${waitlistPosition}

ستكون من بين الأوائل الذين سيختبرون ContraMind عند الإطلاق!

ما يمكنك توقعه:
- الوصول المبكر لمنصة تحليل العقود المدعومة بالذكاء الاصطناعي
- دعم ثنائي اللغة بالعربية والإنجليزية
- أدوات متقدمة لتقييم المخاطر والمراجعة القانونية
- تحديثات حصرية حول تقدم الإطلاق

سنواصل إطلاعك على تقدمنا وإشعارك بمجرد أن تصبح ContraMind جاهزة للإطلاق.

زر موقعنا: https://contramind.ai

شكراً لك لاهتمامك بـ ContraMind.

---
تم إرسال هذا البريد الإلكتروني لأنك انضممت إلى قائمة الانتظار في contramind.ai
  `;
}