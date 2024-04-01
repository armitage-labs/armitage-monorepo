import { Injectable, OnModuleInit } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class EmailService implements OnModuleInit {
  async onModuleInit() {}

  async sendCalculationCompletedMail(toEmail: string) {
    const calculatedUserCredDtos = await fetch(
      `https://api.sendgrid.com/v3/mail/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: `{"personalizations": [{"to": [{"email": "${toEmail}"}]}],"from": {"email": "info@armitage.xyz"},"subject": "Armitage calculation completed","content": [{"type": "text/plain", "value": "Your Armitage team calculation has been completed. Check in to see your construction scores! :)"}]}`,
      },
    );

    console.log('Email sent');
  }
}
