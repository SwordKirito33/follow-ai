import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated December 2025</p>
        </header>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3 text-sm text-gray-700 leading-relaxed">
          <p><strong>1. User Content.</strong> You are responsible for the authenticity of any outputs you upload. Fake or plagiarized submissions will be removed and may result in account termination.</p>
          <p><strong>2. Payments.</strong> Earnings for testers depend on successful verification of outputs. Payouts are processed via integrated payment providers (e.g., Stripe) and may require KYC.</p>
          <p><strong>3. Acceptable Use.</strong> No harassment, spam, or illegal content. Do not upload confidential or sensitive data without authorization.</p>
          <p><strong>4. Intellectual Property.</strong> You retain ownership of your outputs. You grant Follow.ai a license to display them for review verification and community value.</p>
          <p><strong>5. Liability.</strong> The platform is provided “as is”. We are not liable for indirect, incidental, or consequential damages.</p>
          <p><strong>6. Privacy.</strong> We respect user privacy and only use personal data to operate the service. See our Privacy Policy for details.</p>
          <p><strong>7. Changes.</strong> Terms may be updated periodically. Continued use after updates constitutes acceptance.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;

