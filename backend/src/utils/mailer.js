import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const mailFrom = process.env.MAIL_FROM || smtpUser;
const appName = process.env.MAIL_APP_NAME || 'FixBuddy';

const transporter = smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    })
    : null;

export const normalizeEmail = (email) => {
    if (typeof email !== 'string') return '';
    return email.trim().toLowerCase();
};

export const maskEmail = (email) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return '';
    const [localPart, domain] = normalizedEmail.split('@');
    if (!domain) return normalizedEmail;
    if (localPart.length <= 2) return `${localPart[0] || '*'}*@${domain}`;
    return `${localPart.slice(0, 2)}${'*'.repeat(localPart.length - 2)}@${domain}`;
};

// ─── Shared HTML Template ────────────────────────────────────────────────────

const buildEmailHtml = ({ title, preheader = '', bodyHtml, footerNote = '' }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f4f5f7;">${preheader}</div>` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <!-- LOGO HEADER -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#1a1a2e;border-radius:16px;padding:14px 28px;">
                    <!-- Inline SVG Logo -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;padding-right:10px;">
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="28" height="28" rx="8" fill="#0fba5f"/>
                            <path d="M7 14C7 10.134 10.134 7 14 7C17.866 7 21 10.134 21 14C21 17.866 17.866 21 14 21" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
                            <path d="M14 21C12.343 21 11 19.657 11 18C11 16.343 12.343 15 14 15C15.657 15 17 16.343 17 18" stroke="#bbf7d0" stroke-width="2.2" stroke-linecap="round"/>
                            <circle cx="14" cy="14" r="2" fill="white"/>
                          </svg>
                        </td>
                        <td style="vertical-align:middle;">
                          <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">${appName}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CARD -->
          <tr>
            <td style="background-color:#ffffff;border-radius:20px;padding:40px 40px 32px;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.4px;">${title}</h1>
              <div style="width:40px;height:3px;background:#0fba5f;border-radius:2px;margin-bottom:28px;"></div>
              ${bodyHtml}
              ${footerNote ? `<p style="margin:28px 0 0;font-size:12px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:20px;">${footerNote}</p>` : ''}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding:24px 0 8px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:#d1d5db;">
                You received this email because an action was performed on your ${appName} account.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── Core Send ───────────────────────────────────────────────────────────────

const ensureMailerConfigured = () => {
    if (!transporter || !mailFrom) {
        throw new Error('Email delivery is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in backend/.env.');
    }
};

export const sendEmail = async ({ to, subject, text, html }) => {
    const recipient = normalizeEmail(to);
    if (!recipient) throw new Error('A valid recipient email address is required.');
    ensureMailerConfigured();

    const info = await transporter.sendMail({
        from: mailFrom,
        replyTo: mailFrom,
        to: recipient,
        subject,
        text,
        html
    });

    console.log(`[MAIL] Sent "${subject}" to ${recipient} | Message ID: ${info.messageId}`);
    return info;
};

// ─── Email Templates ─────────────────────────────────────────────────────────

export const sendOtpEmail = async ({ to, otp }) => {
    const subject = `Your ${appName} verification code`;
    const text = `Your ${appName} verification code is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`;
    const html = buildEmailHtml({
        title: 'Verification Code',
        preheader: `Your ${appName} login code is ${otp}`,
        bodyHtml: `
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
                Use the code below to complete your sign-in. This code expires in <strong>10 minutes</strong>.
            </p>
            <div style="background:#f0fdf4;border:2px dashed #bbf7d0;border-radius:14px;padding:28px;text-align:center;margin-bottom:24px;">
                <span style="font-size:42px;font-weight:800;letter-spacing:14px;color:#0fba5f;font-family:'Courier New',monospace;">${otp}</span>
            </div>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                🔒 Never share this code with anyone. ${appName} will never ask for your code.
            </p>
        `,
        footerNote: 'If you did not request this code, you can safely ignore this email.'
    });
    return sendEmail({ to, subject, text, html });
};

export const sendCaptainAssignmentEmail = async ({ to, captainName, requestTitle }) => {
    const subject = `New job assigned — ${requestTitle}`;
    const text = `Hello ${captainName}, a new ${appName} request "${requestTitle}" has been assigned to you. Open your dashboard for details.`;
    const html = buildEmailHtml({
        title: 'New Job Assigned',
        preheader: `You have a new job: ${requestTitle}`,
        bodyHtml: `
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
                Hello <strong>${captainName}</strong>,
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
                A new service request has been assigned to you. Please review the details and respond promptly.
            </p>
            <div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 12px 12px 0;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;font-weight:600;color:#166534;text-transform:uppercase;letter-spacing:0.5px;">Job Request</p>
                <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#14532d;">${requestTitle}</p>
            </div>
            <p style="margin:0;font-size:14px;color:#6b7280;">
                Open your captain dashboard to accept or review the request.
            </p>
        `,
        footerNote: 'This assignment was made by the FixBuddy platform.'
    });
    return sendEmail({ to, subject, text, html });
};

export const sendUserRequestStatusEmail = async ({ to, captainName, requestTitle, status, amount }) => {
    const statusConfig = {
        ACCEPTED: {
            subject: `Request accepted — ${requestTitle}`,
            title: 'Request Accepted',
            preheader: `${captainName} accepted your request`,
            color: '#2563eb',
            bgColor: '#eff6ff',
            borderColor: '#93c5fd',
            badge: '✅ Accepted',
            message: `Great news! Captain <strong>${captainName}</strong> has accepted your service request and will be in touch shortly.`
        },
        ONGOING: {
            subject: `Work started — ${requestTitle}`,
            title: 'Work In Progress',
            preheader: `${captainName} has started working on your request`,
            color: '#d97706',
            bgColor: '#fffbeb',
            borderColor: '#fcd34d',
            badge: '🔧 Ongoing',
            message: `Captain <strong>${captainName}</strong> has started working on your request. You'll be notified when it's complete.`
        },
        COMPLETED: {
            subject: `Request completed — ${requestTitle}`,
            title: 'Request Completed',
            preheader: `Your request has been completed`,
            color: '#16a34a',
            bgColor: '#f0fdf4',
            borderColor: '#86efac',
            badge: '🎉 Completed',
            message: `Your service request has been completed by Captain <strong>${captainName}</strong>. Thank you for using ${appName}!`
        }
    };

    const config = statusConfig[status];
    if (!config) return null;

    const text = `${config.message.replace(/<[^>]+>/g, '')} Request: "${requestTitle}".${status === 'COMPLETED' ? ` Total: $${amount ?? 0}.` : ''}`;
    const html = buildEmailHtml({
        title: config.title,
        preheader: config.preheader,
        bodyHtml: `
            <div style="display:inline-block;background:${config.bgColor};border:1px solid ${config.borderColor};border-radius:999px;padding:6px 14px;margin-bottom:20px;">
                <span style="font-size:13px;font-weight:600;color:${config.color};">${config.badge}</span>
            </div>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">${config.message}</p>
            <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:${status === 'COMPLETED' ? '16px' : '0'};">
                <p style="margin:0;font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Service Request</p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#111827;">${requestTitle}</p>
            </div>
            ${status === 'COMPLETED' ? `
            <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;">
                <p style="margin:0;font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Total Amount</p>
                <p style="margin:4px 0 0;font-size:22px;font-weight:800;color:#111827;">$${amount ?? 0}</p>
            </div>` : ''}
        `,
        footerNote: 'You are receiving this update because you have an active service request on FixBuddy.'
    });

    return sendEmail({ to, subject: config.subject, text, html });
};
