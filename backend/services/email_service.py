"""
Email Service
Handles sending email notifications for bookings and other events
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
from datetime import datetime


def send_email(to_email, subject, html_body, plain_body=None):
    """
    Send email via SMTP
    
    Args:
        to_email: Recipient email address
        subject: Email subject line
        html_body: HTML formatted email body
        plain_body: Plain text fallback (optional)
        
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = current_app.config['MAIL_DEFAULT_SENDER']
        msg['To'] = to_email
        
        # Add plain text version if provided
        if plain_body:
            part1 = MIMEText(plain_body, 'plain')
            msg.attach(part1)
        
        # Add HTML version
        part2 = MIMEText(html_body, 'html')
        msg.attach(part2)
        
        # Connect to SMTP server
        with smtplib.SMTP(current_app.config['MAIL_SERVER'], current_app.config['MAIL_PORT']) as server:
            if current_app.config['MAIL_USE_TLS']:
                server.starttls()
            
            # Login if credentials provided
            if current_app.config['MAIL_USERNAME'] and current_app.config['MAIL_PASSWORD']:
                server.login(
                    current_app.config['MAIL_USERNAME'],
                    current_app.config['MAIL_PASSWORD']
                )
            
            # Send email
            server.send_message(msg)
        
        return True, 'Email sent successfully'
    
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False, f'Failed to send email: {str(e)}'


def send_booking_notification(booking):
    """
    Send email notification to admin when new booking is received
    
    Args:
        booking: Booking model instance
    """
    from models.puppy import Puppy
    
    # Get puppy details if puppy_id is provided
    puppy_info = ""
    if booking.puppy_id:
        puppy = Puppy.query.get(booking.puppy_id)
        if puppy:
            puppy_info = f"""
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <strong>Interested Puppy:</strong>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    {puppy.name} ({puppy.gender}, {puppy.color})
                </td>
            </tr>
            """
    
    # HTML Email Template
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                    🐕 New Booking Inquiry
                </h1>
                <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                    K9 GSD Kennel - Ranchi
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px;">
                    You have received a new booking inquiry through your website.
                </p>
                
                <!-- Customer Details Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <tr style="background-color: #f9fafb;">
                        <td colspan="2" style="padding: 16px; font-weight: bold; color: #111827; font-size: 18px;">
                            Customer Information
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; width: 40%;">
                            <strong>Name:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                            {booking.customer_name}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                            <strong>Email:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                            <a href="mailto:{booking.customer_email}" style="color: #10b981; text-decoration: none;">
                                {booking.customer_email}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                            <strong>Phone:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                            <a href="tel:{booking.customer_phone}" style="color: #10b981; text-decoration: none;">
                                {booking.customer_phone}
                            </a>
                        </td>
                    </tr>
                    {puppy_info}
                    {f'''
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                            <strong>Gender Preference:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                            {booking.puppy_gender_preference}
                        </td>
                    </tr>
                    ''' if booking.puppy_gender_preference else ''}
                    <tr>
                        <td style="padding: 12px;">
                            <strong>Submitted:</strong>
                        </td>
                        <td style="padding: 12px;">
                            {booking.created_at.strftime('%B %d, %Y at %I:%M %p')}
                        </td>
                    </tr>
                </table>
                
                <!-- Message -->
                <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #111827;">Customer Message:</p>
                    <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">
{booking.message}
                    </p>
                </div>
                
                <!-- Quick Actions -->
                <div style="text-align: center; margin-top: 32px;">
                    <a href="https://wa.me/{booking.customer_phone.replace('+', '').replace('-', '').replace(' ', '')}" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 12px;">
                        📱 WhatsApp Customer
                    </a>
                    <a href="mailto:{booking.customer_email}" 
                       style="display: inline-block; background: #f59e0b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        ✉️ Send Email
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    This is an automated notification from K9 GSD Kennel website.
                </p>
                <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                    Login to your admin dashboard to manage this inquiry.
                </p>
            </div>
            
        </div>
    </body>
    </html>
    """
    
    # Plain text version
    plain_body = f"""
    NEW BOOKING INQUIRY - K9 GSD Kennel
    
    Customer Details:
    Name: {booking.customer_name}
    Email: {booking.customer_email}
    Phone: {booking.customer_phone}
    
    Message:
    {booking.message}
    
    Submitted: {booking.created_at.strftime('%B %d, %Y at %I:%M %p')}
    
    ---
    K9 GSD Kennel - Ranchi
    """
    
    # Send to admin
    admin_email = current_app.config['ADMIN_EMAIL']
    subject = f"🐕 New Booking: {booking.customer_name}"
    
    return send_email(admin_email, subject, html_body, plain_body)


def send_booking_confirmation(booking):
    """
    Send confirmation email to customer
    
    Args:
        booking: Booking model instance
    """
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                    Thank You for Your Inquiry! 🎉
                </h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <p style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: bold;">
                    Dear {booking.customer_name},
                </p>
                
                <p style="margin: 0 0 24px 0; color: #4b5563; line-height: 1.6;">
                    Thank you for your interest in our German Shepherd puppies! We have received your inquiry and will get back to you within 24 hours.
                </p>
                
                <!-- What's Next -->
                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 12px 0; color: #059669; font-size: 16px;">What Happens Next?</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                        <li style="margin-bottom: 8px;">Our team will review your inquiry</li>
                        <li style="margin-bottom: 8px;">We'll contact you via phone or WhatsApp</li>
                        <li style="margin-bottom: 8px;">Schedule a kennel visit (if local)</li>
                        <li>Discuss puppy availability and bloodlines</li>
                    </ul>
                </div>
                
                <!-- Contact Info -->
                <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 12px 0; color: #d97706; font-size: 16px;">Need Immediate Assistance?</h3>
                    <p style="margin: 0; color: #92400e;">
                        <strong>WhatsApp:</strong> <a href="https://wa.me/916201024665" style="color: #d97706;">+91 6201024665</a><br>
                        <strong>Phone:</strong> <a href="tel:+916201024665" style="color: #d97706;">+91 6201024665</a><br>
                        <strong>Email:</strong> <a href="mailto:ranbeersinghcauhan@gmail.com" style="color: #d97706;">ranbeersinghcauhan@gmail.com</a>
                    </p>
                </div>
                
                <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                    We're excited to help you find your perfect German Shepherd companion!
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: bold;">
                    K9 GSD Kennel - Ranchi
                </p>
                <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                    Premium German Shepherd Breeding Since 2020
                </p>
            </div>
            
        </div>
    </body>
    </html>
    """
    
    plain_body = f"""
    Thank you for your inquiry, {booking.customer_name}!
    
    We have received your message and will get back to you within 24 hours.
    
    What happens next?
    - Our team will review your inquiry
    - We'll contact you via phone or WhatsApp
    - Schedule a kennel visit if you're local
    - Discuss puppy availability and bloodlines
    
    Need immediate assistance?
    WhatsApp: +91 6201024665
    Phone: +91 6201024665
    Email: ranbeersinghcauhan@gmail.com
    
    We're excited to help you find your perfect German Shepherd companion!
    
    Best regards,
    K9 GSD Kennel - Ranchi
    """
    
    subject = "Thank You for Your Inquiry - K9 GSD Kennel"
    
    return send_email(booking.customer_email, subject, html_body, plain_body)


def send_test_email():
    """
    Send a test email to verify configuration
    """
    html_body = """
    <html>
    <body>
        <h2>Test Email from K9 GSD Kennel</h2>
        <p>If you're seeing this, your email configuration is working correctly!</p>
    </body>
    </html>
    """
    
    admin_email = current_app.config['ADMIN_EMAIL']
    return send_email(admin_email, "Test Email - K9 GSD Kennel", html_body, "Test email content")