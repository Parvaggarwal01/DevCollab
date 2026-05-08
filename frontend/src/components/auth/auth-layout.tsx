import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#111111] px-4 py-12">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="DevCollab Logo"
              width={48}
              height={48}
              className="mb-4"
            />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
