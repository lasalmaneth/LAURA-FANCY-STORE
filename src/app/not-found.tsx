import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 px-6 text-center">
      <span className="font-mono text-xs tracking-[0.2em] text-grey uppercase mb-2">
        // 404 ERROR
      </span>
      <h1 className="font-display text-6xl md:text-8xl tracking-wider mb-4">PAGE NOT FOUND</h1>
      <p className="text-xs sm:text-sm text-[#444] mb-8 max-w-md">
        The piece or page you are looking for does not exist or has been relocated.
      </p>
      <Link href="/" className="btn btn--primary">
        Return to Workshop →
      </Link>
    </div>
  );
}
