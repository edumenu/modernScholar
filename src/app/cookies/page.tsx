export const metadata = {
  title: "Cookie Policy | Modern Scholar",
  description: "Cookie policy for Modern Scholar.",
};

export default function CookiesPage() {
  return (
    <div className="page-padding-y flex flex-col gap-8">
      <div className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          Cookie Policy
        </h1>
        <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
          This policy is being finalized. Our cookie policy will be published
          before the platform launches publicly.
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
