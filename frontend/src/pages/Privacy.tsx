import React from 'react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';

const Privacy = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: 4/7/2025
          </p>
          
          <Separator className="my-8" />
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              CineNiche is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use our website and services, including our streaming platform.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect the following types of personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>City and Country: We collect location data such as your city and country to improve the user experience and provide region-specific content.</li>
              <li>Language: We may collect your preferred language to ensure the platform is accessible to you in your preferred language.</li>
              <li>Names: If you register for an account or provide information, we may collect your name to personalize your experience and communication.</li>
              <li>Preferences: We collect information about your viewing preferences and interactions with content to help us personalize recommendations and improve your streaming experience.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To personalize and improve the content and recommendations you receive on our streaming service based on your location, language, and preferences.</li>
              <li>To provide and maintain our Services, including user support and troubleshooting.</li>
              <li>To store and apply your preferences (e.g., review history, preferred genres) across devices.</li>
              <li>To communicate with you regarding updates, notifications, and other relevant information about our Services.</li>
              <li>To analyze usage trends and preferences to improve the platform.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Legal Basis for Processing</h2>
            <p className="mb-4">We process your personal data based on the following legal grounds:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Consent: When you provide your information voluntarily, such as registering for an account or subscribing to our newsletter.</li>
              <li>Contractual Necessity: To provide the Services that you request, such as streaming content.</li>
              <li>Legitimate Interests: We may process your data to improve our Services and offer personalized content.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Data Sharing and Transfers</h2>
            <p className="mb-4">We do not sell or rent your personal data to third parties. However, we may share your data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Service Providers: Third-party companies that help us operate the platform, such as hosting services, payment processors, and analytics providers.</li>
              <li>Legal Obligations: If required by law, we may disclose your information to comply with legal obligations, such as a subpoena or court order.</li>
            </ul>
            <p>
              We may also transfer your data to countries outside the European Economic Area (EEA), ensuring appropriate safeguards are in place.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
            <p className="mb-4">Under the GDPR, you have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Right of Access: You can request a copy of the personal data we hold about you.</li>
              <li>Right to Rectification: You can request to update or correct inaccurate information.</li>
              <li>Right to Erasure: You can request to delete your personal data in certain circumstances.</li>
              <li>Right to Restrict Processing: You can request to limit how we process your personal data.</li>
              <li>Right to Data Portability: You can request to receive your personal data in a structured, commonly used format.</li>
              <li>Right to Object: You can object to the processing of your personal data for certain purposes, such as direct marketing.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at +1 (760) 555-8437.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Security</h2>
            <p>
              We take appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or destruction. However, please be aware that no data transmission or storage system can be guaranteed 100% secure.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our site, analyze usage, and offer personalized content. You can manage your cookie preferences through your browser settings.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the “Last updated” date will be revised accordingly. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or how we handle your personal data, please contact us at:
            </p>
            <address className="not-italic">
              CineNiche<br />
              251 Not University Ave, Not Provo, UT 84601<br />
              customersupport@cineniche.com<br />
              +1 (760) 555-8437
            </address>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
