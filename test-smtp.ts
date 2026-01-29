/**
 * SMTP Email Service Test Script
 * 
 * This script tests the SMTP email sending functionality.
 * 
 * Usage:
 *   npx tsx test-smtp.ts
 * 
 * Before running this script, make sure you have configured the following environment variables:
 *   - SMTP_HOST: SMTP server host (e.g., smtp.sendgrid.net)
 *   - SMTP_PORT: SMTP server port (e.g., 587 for TLS, 465 for SSL)
 *   - SMTP_USER: SMTP username (e.g., apikey for SendGrid)
 *   - SMTP_PASS: SMTP password (e.g., your SendGrid API key)
 *   - SMTP_FROM: Sender email address (e.g., noreply@yourdomain.com)
 */

import { sendInquiryEmail, verifySMTPConnection } from './server/emailService';

async function testSMTP() {
  console.log('=== SMTP Email Service Test ===\n');

  // Check if SMTP is configured
  console.log('Checking SMTP configuration...');
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.log('\nPlease set the following environment variables:');
    console.log('  SMTP_HOST: SMTP server host (e.g., smtp.sendgrid.net)');
    console.log('  SMTP_PORT: SMTP server port (e.g., 587 for TLS, 465 for SSL)');
    console.log('  SMTP_USER: SMTP username (e.g., apikey for SendGrid)');
    console.log('  SMTP_PASS: SMTP password (e.g., your SendGrid API key)');
    console.log('  SMTP_FROM: Sender email address (e.g., noreply@yourdomain.com)');
    console.log('\nExample:');
    console.log('  export SMTP_HOST=smtp.sendgrid.net');
    console.log('  export SMTP_PORT=587');
    console.log('  export SMTP_USER=apikey');
    console.log('  export SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxx');
    console.log('  export SMTP_FROM=noreply@yourdomain.com');
    console.log('\nThe email service will log email content without sending if SMTP is not configured.');
    console.log('');
  } else {
    console.log('✅ All required environment variables are set\n');

    // Verify SMTP connection
    console.log('Verifying SMTP connection...');
    const isConnected = await verifySMTPConnection();
    
    if (!isConnected) {
      console.error('❌ SMTP connection verification failed');
      console.log('Please check your SMTP configuration and try again.\n');
      process.exit(1);
    }
    
    console.log('✅ SMTP connection verified successfully\n');
  }

  // Send test email
  console.log('Sending test inquiry email...');
  
  const testData = {
    inquiryNumber: 'INQ-20260128-TEST',
    userName: '测试用户',
    userEmail: process.env.TEST_EMAIL || 'test@example.com',
    userCompany: '测试公司',
    userPhone: '+86 138-0000-0000',
    userMessage: '这是一封测试邮件，用于验证 SMTP 邮件发送功能是否正常工作。',
    products: [
      {
        name: 'Agilent ZORBAX Eclipse Plus C18',
        partNumber: '959963-902',
      },
      {
        name: 'Waters XBridge C18',
        partNumber: '186003117',
      },
    ],
    createdAt: new Date(),
  };

  const success = await sendInquiryEmail(testData);

  if (success) {
    console.log('\n✅ Test email sent successfully!');
    console.log(`   Recipient: ${testData.userEmail}`);
    console.log(`   Inquiry Number: ${testData.inquiryNumber}`);
    
    if (missingVars.length === 0) {
      console.log('\n📧 Please check your inbox for the test email.');
      console.log('   Note: It may take a few minutes to arrive.');
      console.log('   Check your spam folder if you don\'t see it in your inbox.');
    } else {
      console.log('\n📝 Email content has been logged above (SMTP not configured).');
    }
  } else {
    console.error('\n❌ Failed to send test email');
    console.log('Please check the error messages above for details.\n');
    process.exit(1);
  }

  console.log('\n=== Test Complete ===\n');
}

// Run the test
testSMTP().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
