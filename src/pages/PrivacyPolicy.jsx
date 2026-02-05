import React from "react";

export default function PrivacyPolicy() {
  const lastUpdated = "February 5, 2026";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold">Privacy Policy</h1>
          <p className="text-sm text-white/60">Last updated: {lastUpdated}</p>
        </div>

        <div className="mt-6 space-y-6 text-sm leading-6 text-white/80">
          <p>
            This Privacy Policy explains how{" "}
            <span className="font-semibold text-white">BillPay</span> (“we”,
            “us”, “our”) collects, uses, shares, and protects information when
            you use our website and app (the “Service”).
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-white/80">
              <span className="font-semibold text-white">
                Demo / Mock Notice:
              </span>{" "}
              This is a demo application. Some flows (including payments) may be
              simulated using placeholder or mock services. Do not use real card
              details, bank credentials, or sensitive information.
            </p>
          </div>

          <section>
            <h2 className="text-base font-extrabold text-white">
              1) Information We Collect
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-white/80">
              <li>
                <span className="font-semibold text-white">
                  Account details (demo login):
                </span>{" "}
                name, mobile number, and a password (stored locally for demo, if
                enabled).
              </li>
              <li>
                <span className="font-semibold text-white">
                  Transaction context:
                </span>{" "}
                category selected (e.g., electricity, mobile recharge),
                biller/provider selected, customer reference (e.g., consumer
                number), amount, and payment method selected.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Device & usage data:
                </span>{" "}
                basic analytics like pages visited, button clicks, and error
                logs (only if you enable analytics/monitoring).
              </li>
              <li>
                <span className="font-semibold text-white">
                  Support communications:
                </span>{" "}
                if you contact support, we may collect details you share (e.g.,
                email, screenshots).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              2) What We Don’t Intentionally Collect
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-white/80">
              <li>
                We do not ask for or store full card numbers, CVV, netbanking
                passwords, or UPI PINs.
              </li>
              <li>
                If you enter sensitive information into a demo field, you do so
                at your own risk. Please avoid it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              3) How We Use Information
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-white/80">
              <li>
                To provide the Service (bill fetch, payment initiation, status
                display).
              </li>
              <li>
                To personalize your experience (recent billers, saved
                preferences, offers).
              </li>
              <li>
                To troubleshoot issues, prevent abuse, and improve reliability
                and UI/UX.
              </li>
              <li>To comply with legal obligations where applicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              4) Payments & Third-Party Services
            </h2>
            <p className="mt-2 text-white/80">
              When integrated with real payment providers or bill-fetch
              partners, certain information may be shared with them to complete
              transactions, such as your selected provider, customer reference,
              amount, and payment status identifiers.
            </p>
            <p className="mt-2 text-white/80">
              Third parties have their own privacy policies, and we recommend
              reviewing them once you use a real payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              5) Cookies & Local Storage
            </h2>
            <p className="mt-2 text-white/80">
              We may use cookies and/or local storage to keep you signed in,
              remember preferences, and store demo history (like recent
              payments). You can clear your browser storage to remove this data.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              6) Data Retention
            </h2>
            <p className="mt-2 text-white/80">
              We retain information only as long as necessary for the purposes
              described above. In the demo version, transaction history may be
              stored locally in your browser until you clear it.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">7) Security</h2>
            <p className="mt-2 text-white/80">
              We take reasonable measures to protect information. However, no
              method of transmission or storage is 100% secure. Please use the
              Service responsibly and avoid entering sensitive credentials in
              demo fields.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              8) Your Choices
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-white/80">
              <li>
                You can sign out and clear app data by clearing browser storage.
              </li>
              <li>You can choose not to share optional information.</li>
              <li>
                If analytics is enabled, you may opt out via your browser
                settings or installed blockers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              9) Children’s Privacy
            </h2>
            <p className="mt-2 text-white/80">
              The Service is not intended for children under the age of 13. We
              do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              10) Changes to This Policy
            </h2>
            <p className="mt-2 text-white/80">
              We may update this Privacy Policy from time to time. We will
              update the “Last updated” date at the top. Continued use of the
              Service after changes means you accept the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-white">
              11) Contact Us
            </h2>
            <p className="mt-2 text-white/80">
              If you have questions about this Privacy Policy, contact us at{" "}
              <span className="font-semibold text-white">
                support@yourdomain.com
              </span>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
