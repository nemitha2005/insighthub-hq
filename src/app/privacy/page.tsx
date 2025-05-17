import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - InsightHub',
  description: 'Privacy policy and data protection practices for InsightHub AI-powered business intelligence platform',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="outline" asChild className="mb-6">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                InsightHub (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
                our AI-powered business intelligence platform. Please read this Privacy Policy carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Create an account or register for our services</li>
                  <li>Contact us with inquiries or for customer support</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Participate in surveys or feedback requests</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Personal information may include: name, email address, phone number, company name, and any other
                  information you choose to provide.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">2.2 Business Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you use our service, you may upload business data files (CSV, Excel, etc.) for analysis. This
                  data remains under your ownership and control. We process this data solely to provide our AI-powered
                  analytics services to you.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">2.3 Usage Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We automatically collect certain information about your device and how you interact with our service,
                  including: IP address, browser type, operating system, referring URLs, page views, and usage patterns.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing your data analysis requests and generating insights</li>
                <li>Communicating with you about your account and our services</li>
                <li>Sending you technical notices, updates, and marketing communications</li>
                <li>Responding to your comments, questions, and customer service requests</li>
                <li>Monitoring and analyzing usage patterns to improve user experience</li>
                <li>Detecting, preventing, and addressing technical issues and security threats</li>
                <li>Complying with legal obligations and enforcing our terms of service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>With your explicit consent</li>
                <li>
                  To trusted third-party service providers who assist in operating our service (under strict
                  confidentiality agreements)
                </li>
                <li>To comply with legal obligations, such as responding to subpoenas or court orders</li>
                <li>To protect and defend our rights or property</li>
                <li>In connection with a business transfer, such as a merger or acquisition</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Important:</strong> Your business data uploaded to our platform is never shared with third
                parties for any purpose other than providing our services to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your information
                against unauthorized access, alteration, disclosure, or destruction. These measures include encryption
                in transit and at rest, access controls, security monitoring, and regular security assessments. However,
                no method of transmission over the internet or electronic storage is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information and business data only as long as necessary to fulfill the purposes
                outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. You
                can delete your uploaded data files at any time through your account dashboard. When you delete your
                account, we will delete your personal information and business data, subject to legal retention
                requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>Access:</strong> You can request a copy of the personal information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> You can request that we correct any inaccurate or incomplete information
                </li>
                <li>
                  <strong>Deletion:</strong> You can request that we delete your personal information
                </li>
                <li>
                  <strong>Portability:</strong> You can request that we transfer your data to another service
                </li>
                <li>
                  <strong>Objection:</strong> You can object to certain processing of your personal information
                </li>
                <li>
                  <strong>Restriction:</strong> You can request that we restrict processing of your personal information
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:nemithan05@gmail.com" className="text-blue-500 hover:text-blue-400 underline">
                  nemithan05@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Similar Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are
                small data files stored on your device that help us provide and improve our services. You can manage
                your cookie preferences through your browser settings, but please note that disabling cookies may affect
                the functionality of our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that
                any international transfers of personal information are protected by appropriate safeguards, such as
                standard contractual clauses or adequacy decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for children under the age of 13, and we do not knowingly collect personal
                information from children under 13. If we become aware that we have collected personal information from
                a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service may integrate with third-party services (such as authentication providers or AI services).
                These third-party services have their own privacy policies, and we encourage you to review them. We are
                not responsible for the privacy practices of these third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Updates to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
                operational, or regulatory reasons. We will notify you of any material changes by posting the new
                Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our
                service after the changes have been posted constitutes acceptance of the revised Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:nemithan05@gmail.com" className="text-blue-500 hover:text-blue-400 underline">
                    nemithan05@gmail.com
                  </a>
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Subject Line:</strong> Privacy Policy Inquiry - InsightHub
                </p>
              </div>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-4">Data Protection Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">What We Protect</h3>
                  <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                    <li>✓ Your account information</li>
                    <li>✓ Your business data files</li>
                    <li>✓ Your usage and preferences</li>
                    <li>✓ Your communications with us</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How We Protect It</h3>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                    <li>✓ Encryption in transit and at rest</li>
                    <li>✓ Access controls and authentication</li>
                    <li>✓ Regular security audits</li>
                    <li>✓ Minimal data collection</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
