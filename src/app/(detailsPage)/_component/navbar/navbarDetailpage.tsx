"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserAuth } from "@/hooks/useUserAuth";
import { CornerUpLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NavbarDetailpage = () => {
  const [previousPath, setPreviousPath] = useState<string | null>("");
  useEffect(() => {
    setPreviousPath(sessionStorage.getItem("previousPath"));
  }, []);
  const router = useRouter();

  const { userData, isUserPending } = useUserAuth([
    "admin",
    "teacher",
    "student",
    "parent",
  ]);

  const userRole = isUserPending
    ? "در حال بارگذاری..."
    : userData?.role === "admin"
    ? "مدیر مدرسه"
    : userData?.role === "teacher"
    ? "معلم"
    : userData?.role === "student"
    ? "دانش‌آموز"
    : userData?.role === "parent"
    ? "خانواده"
    : "نامشخص";

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-6">
        {isUserPending ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : userData?.img ? (
          <Avatar>
            <AvatarImage src={userData?.img} />
          </Avatar>
        ) : (
          <Avatar>
            <AvatarFallback>{userData?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col gap-2">
          {isUserPending ? (
            <Skeleton className="h-3 w-16" />
          ) : (
            <span className="text-xs font-medium">{userData?.name}</span>
          )}
          {isUserPending ? (
            <Skeleton className="h-2 w-10" />
          ) : (
            <span className="text-[10px] text-right text-gray-500">
              {userRole}
            </span>
          )}
        </div>
      </div>
      <div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            if (previousPath) {
              router.push(previousPath);
            } else {
              router.push("/list/result");
            }
          }}
        >
          <span>بازگشت</span>
          <CornerUpLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
export default NavbarDetailpage;
