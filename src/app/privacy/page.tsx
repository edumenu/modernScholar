export const metadata = {
  title: "Privacy Policy | Modern Scholar",
  description: "Privacy policy for Modern Scholar.",
};

export default function PrivacyPage() {
  return (
    <div className="page-padding-y flex flex-col gap-8">
      <div className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
          This policy is being finalized. We are committed to protecting your
          privacy and will publish our full privacy policy before collecting any
          personal data.
        </p>
        <p className="mt-4 text-sm text-on-surface-variant">
          If you have questions, contact us at{" "}
          <a
            href="mailto:dearmodernscholar@gmail.com"
            className="text-primary underline underline-offset-2"
          >
            dearmodernscholar@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
