import {
  BookOpenText,
  CalendarDays,
  CircleUser,
  Edit,
  Loader,
  Trash2,
  User,
  UserCircle2,
} from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useUserAuth } from "@/hooks/useUserAuth";
import useGetTeacherData from "@/hooks/useGetTeacherData";
import { useEffect, useState } from "react";
import { FormattedTeacher } from "@/actions/teacherAction";

const TeacherCard = ({ control }: { control: string }) => {
  const { isUserError, isUserPending, userData } = useUserAuth(["teacher"]);
  const { isTeacherDataError, isTeacherDataPending, teacherData } =
    useGetTeacherData(userData);

  const [teacherInfo, setTeacherInfo] = useState<
    FormattedTeacher | undefined
  >();

  useEffect(() => {
    const teacherInfo = teacherData?.find(
      (teacher) => teacher.id === userData?.id
    );

    setTeacherInfo(teacherInfo);
  }, [teacherData, userData]);

  return (
    <div className="bg-Sky w-full rounded-xl shadow-sm border border-gray-300 p-2">
      <div className="flex gap-4 items-center justify-start h-full">
        {userData?.img ? (
          <Avatar className="w-28 h-28">
            <AvatarImage src={userData.img} alt="teacher photo" />
          </Avatar>
        ) : (
          <Avatar className="w-28 h-28 justify-center items-center m-auto">
            <UserCircle2
              className="w-full h-full text-gray-600"
              strokeWidth={1}
            />
          </Avatar>
        )}

        <div className="flex flex-col gap-2 font-bold w-full">
          <div className="flex justify-between items-center">
            {isUserPending ? (
              <p className="text-gray-600 animate-pulse">نام معلم</p>
            ) : (
              !isUserError && <p>{`${userData?.name} ${userData?.surname}`}</p>
            )}

            <div className="flex gap-1">
              <Edit className="size-4 text-gray-500 ml-2 cursor-not-allowed opacity-40" />
              {control === "admin" && (
                <Trash2 className="size-4 text-gray-500 cursor-pointer" />
              )}
            </div>
          </div>

          <p className="text-[0.5rem] md:text-[0.6rem] text-gray-600 w-full">
            توضیحاتی درمورد معلم
          </p>
          <div className="mt-2 flex flex-row gap-y-2 xl:flex-col 2xl:flex-row  w-full ">
            <div className="flex  gap-1 items-center w-1/2 xl:w-full 2xl:w-1/2 ">
              <BookOpenText className="size-4" />
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="text-[0.5rem] md:text-[0.6rem] font-semibold">
                  شماره تماس :
                </p>
                {isUserPending ? (
                  <div>
                    <Loader className="text-gray-600 animate-spin w-4 h-4" />
                  </div>
                ) : (
                  !isUserError && (
                    <p className="text-[0.5rem] md:text-[0.6rem] font-semibold">
                      {userData?.phone}
                    </p>
                  )
                )}
              </div>
            </div>
            <div className="flex gap-1 items-center w-1/2 xl:w-full 2xl:w-1/2  ">
              <CalendarDays className="size-4" />
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="text-[0.5rem] md:text-[0.6rem] font-semibold">
                  ایمیل :
                </p>
                {isUserPending ? (
                  <div>
                    <Loader className="text-gray-600 animate-spin w-4 h-4" />
                  </div>
                ) : (
                  !isUserError && (
                    <p className="text-[0.5rem] md:text-[0.6rem] font-semibold">
                      {userData?.email}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex  flex-row gap-y-2 xl:flex-col 2xl:flex-row  w-full ">
            <div className="flex gap-1 items-center w-1/2 xl:w-full 2xl:w-1/2 ">
              <CircleUser className="size-4" />
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="text-[0.5rem] md:text-[0.6rem] font-semibold">
                  رویداد های پیش رو :
                </p>
                {isUserPending || isTeacherDataPending ? (
                  <div>
                    <Loader className="text-gray-600 animate-spin w-4 h-4" />
                  </div>
                ) : (
                  !isUserError &&
                  !isTeacherDataError && (
                    <p className="text-[0.5rem] md:text-[0.6rem] font-semibold">
                      {teacherInfo?.eventOnGoing}
                    </p>
                  )
                )}
              </div>
            </div>
            <div className="flex gap-1 items-center w-1/2 xl:w-full 2xl:w-1/2 ">
              <User className="size-4" />
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="text-[0.5rem] md:text-[0.6rem] font-semibold">
                  جنسیت :
                </p>
                {isUserPending ? (
                  <div>
                    <Loader className="text-gray-600 animate-spin w-4 h-4" />
                  </div>
                ) : (
                  !isUserError && (
                    <p className="text-[0.5rem] md:text-[0.6rem] font-semibold">
                      {userData?.sex === "MALE" ? "مرد" : "زن"}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeacherCard;
