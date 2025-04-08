"use client";
import { getUserInfo } from "@/actions/dashboardAction";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useUserAuth(allowedRoles: string[]) {
  const router = useRouter();

  const {
    isPending: isUserPending,
    isError: isUserError,
    data: userData,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfo(),
  });

  useEffect(() => {
    if (!isUserPending) {
      if (!userData) {
        return router.push("/login");
      }
      if (!allowedRoles.includes(userData?.role)) {
        router.push("/login");
      }
    }
  }, [isUserPending, userData, allowedRoles, router]);

  return { isUserPending, isUserError, userData };
}
