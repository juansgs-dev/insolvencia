"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, usuario, isAuthenticated, logout } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {

      if (!isAuthenticated || !token) {
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/documentos")) {
          router.replace("/login");
        } else {
          setIsVerifying(false);
        }
        return;
      }

      try {
        const res = await fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          logout();
          router.replace("/login");
          return;
        }

        if (requiredRole && usuario && !requiredRole.includes(usuario.rol)) {
          router.replace("/dashboard");
          return;
        }

        setIsVerifying(false);
      } catch {
        logout();
        router.replace("/login");
      }
    };

    verify();
  }, [token, isAuthenticated, usuario, requiredRole, pathname, router, logout]);

  if (isVerifying) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
