export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email 📩</h1>
        <p className="text-neutral-300 mb-6">
          We’ve sent a verification link to your inbox. <br />
          Please click the link to continue.
        </p>
        <p className="text-sm text-neutral-500">
          Didn’t receive it? Check your spam folder or request a new link.
        </p>
      </div>
    </div>
  );
}
