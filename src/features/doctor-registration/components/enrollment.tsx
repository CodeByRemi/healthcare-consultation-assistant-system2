export default function EnrollmentIntro() {
  return (
    <div className="lg:w-1/3 space-y-6">
      <h1 className="text-4xl lg:text-5xl font-black leading-tight">
        Medical Practitioner Enrollment
      </h1>

      <p className="text-text-muted text-lg">
        Join an exclusive network of world-class medical professionals.
      </p>

      <div className="border-t border-border-dark pt-6 space-y-4">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-primary">
            verified_user
          </span>
          <div>
            <h4 className="font-medium">HIPAA Compliant</h4>
            <p className="text-sm text-text-muted">
              Your data is encrypted and secure.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="material-symbols-outlined text-primary">
            workspace_premium
          </span>
          <div>
            <h4 className="font-medium">Exclusive Benefits</h4>
            <p className="text-sm text-text-muted">
              Access premium insurance rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
