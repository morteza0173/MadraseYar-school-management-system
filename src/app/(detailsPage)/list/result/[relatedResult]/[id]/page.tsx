"use client";

import { updateOrCreateScore } from "@/actions/resultDetailPageAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAssignmentData from "@/hooks/useGetAssignmentData";
import useGetExamData from "@/hooks/useGetExamData";
import useGetStudentResultData from "@/hooks/useGetStudentResultData";
import { useUserAuth } from "@/hooks/useUserAuth";
import { calculateDaysDifference } from "@/lib/calculateDaysDifference";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Edit, Loader2, Trash, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Exam {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  lessonId: number | undefined;
  lessonName: string;
  classId: number | undefined;
  className: string;
}

export interface Assignment {
  id: number;
  title: string;
  startDate: Date;
  dueDate: Date;
  lessonId: number | undefined;
  lessonName: string;
  classId: number | undefined;
  className: string;
}

const ResultdetailPage = () => {
  const [editValue, setEditValue] = useState<string | null>(null);
  const [scoreValue, setScoreValue] = useState<number | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(
    null
  );

  const queryClient = useQueryClient();

  const [relatedData, setRelatedData] = useState<Exam | Assignment | undefined>(
    undefined
  );

  const params = useParams();

  const { id, relatedResult } = params;

  const decodedRelatedResult = Array.isArray(relatedResult)
    ? decodeURIComponent(relatedResult[0])
    : decodeURIComponent(relatedResult || "");

  const relatedDataIsExam = decodedRelatedResult === "امتحان";

  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);

  const { examsData, isExamsPending } = useGetExamData(userData);
  const { assignmentsData, isAssignmentsPending } =
    useGetAssignmentData(userData);

  const { isResultPending, resultData } = useGetStudentResultData({
    id: Number(id),
    decodedRelatedResult,
    role: userData?.role || "",
  });

  const { mutate: updateScoreMutate, isPending: updateScorePending } =
    useMutation({
      mutationFn: async (data: FormData) => updateOrCreateScore(data),
      onSuccess: (data) => {
        toast.success(data.message || "نمره ثبت شد");
        queryClient.invalidateQueries({ queryKey: ["studentResult"] });
        queryClient.invalidateQueries({ queryKey: ["results"] });
        setEditValue(null);
        setScoreValue(null);
      },
      onError: (error) => {
        toast.error(error.message || "خطایی در ثبت نمره رخ داد");
      },
    });

  const { mutate: deleteScoreMutate } = useMutation({
    mutationFn: async (data: FormData) => updateOrCreateScore(data),
    onSuccess: (data) => {
      toast.success(data.message || "نمره حذف شد");
      queryClient.invalidateQueries({ queryKey: ["studentResult"] });
      queryClient.invalidateQueries({ queryKey: ["results"] });
      setEditValue(null);
      setScoreValue(null);
    },
    onError: (error) => {
      toast.error(error.message || "خطایی در حذف نمره رخ داد");
    },
    onSettled: () => {
      setDeletingStudentId(null);
    },
  });

  useEffect(() => {
    if (relatedDataIsExam) {
      const singleExamData = examsData?.find((exam) => exam.id === Number(id));
      setRelatedData(singleExamData);
    } else if (!relatedDataIsExam) {
      const singleAssignmentData = assignmentsData?.find(
        (assignment) => assignment.id === Number(id)
      );
      setRelatedData(singleAssignmentData);
    }
  }, [decodedRelatedResult, id, examsData, assignmentsData, relatedDataIsExam]);

  const bgColor = relatedDataIsExam
    ? "bg-blue-500 text-white hover:bg-blue-300"
    : "bg-green-500 text-white hover:bg-green-300";

  const endDateTitle = relatedDataIsExam
    ? "تاریخ شروع امتحان"
    : "تاریخ تحویل تکلیف";

  const endDateData =
    relatedDataIsExam && relatedData && "startTime" in relatedData
      ? relatedData.startTime
      : !relatedDataIsExam && relatedData && "dueDate" in relatedData
      ? relatedData.dueDate
      : "نامشخص";

  const daysDifference = endDateData
    ? calculateDaysDifference(new Date(endDateData))
    : null;

  const formattedDate = new Date(endDateData).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    timeZone: "Asia/Tehran",
  });

  const handleScoreChange = (studentId: string) => {
    const formData = new FormData();
    formData.append("scoreValue", String(scoreValue));
    formData.append("studentId", studentId);
    formData.append("relatedType", decodedRelatedResult);
    formData.append("relatedId", String(id));

    updateScoreMutate(formData);
  };

  const handleDeleteStudentScore = (studentId: string) => {
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("relatedType", decodedRelatedResult);
    formData.append("relatedId", String(id));

    setDeletingStudentId(studentId);

    deleteScoreMutate(formData);
  };

  return (
    <Card className="mt-8">
      <CardContent>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-2">
            <Badge variant="secondary" className={`${bgColor}`}>
              {decodedRelatedResult}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-orange-200 hover:bg-orange-100"
            >
              {isExamsPending || isAssignmentsPending ? (
                <Loader2 className="animate-spin w-2 h-2" />
              ) : (
                `کلاس ${relatedData?.className}`
              )}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-rose-200 hover:bg-rose-100"
            >
              {isExamsPending || isAssignmentsPending ? (
                <Loader2 className="animate-spin w-2 h-2" />
              ) : (
                daysDifference
              )}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                {isExamsPending || isAssignmentsPending ? (
                  <Skeleton className="w-28 md:w-48 lg:w-72 h-4 md:h-6" />
                ) : (
                  <h1 className="font-bold md:text-lg lg:text-xl">
                    {relatedData?.title}
                  </h1>
                )}
              </div>
              <div className="flex items-center mt-4">
                {isExamsPending || isAssignmentsPending ? (
                  <Skeleton className="w-20 md:w-28 lg:w-52 h-3 md:h-4" />
                ) : (
                  <h2 className="font-bold text-sm md:text-base">
                    {relatedData?.lessonName}
                  </h2>
                )}
              </div>
            </div>
            <div>
              <div>
                <p className="text-xs md:text-sm lg:text-base">
                  {endDateTitle}
                </p>
              </div>
              {isExamsPending || isAssignmentsPending ? (
                <Skeleton className="w-16 md:w-20 lg:w-28 h-3 md:h-4 mt-4" />
              ) : (
                <div className="mt-4 text-xs md:text-sm lg:text-base">
                  {formattedDate}
                </div>
              )}
            </div>
          </div>
          <h3 className="text-xs md:text-sm lg:text-base text-gray-500">
            لیست دانش اموزان
          </h3>
          <div>
            <table className="table-auto w-full border ">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-right w-20 text-xs md:text-sm lg:text-base">
                    رتبه
                  </th>
                  <th className="border px-4 py-2 text-right text-xs md:text-sm lg:text-base">
                    نام
                  </th>
                  <th className="border-t px-4 py-2 text-center w-20 text-xs md:text-sm lg:text-base">
                    نمره
                  </th>
                </tr>
              </thead>
              <tbody>
                {isExamsPending || isAssignmentsPending || isResultPending ? (
                  <tr className="hover:bg-gray-50 border">
                    <td colSpan={3} className="text-center py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                        <span className="text-xs md:text-sm lg:text-base">
                          در حال دریافت اطلاعات...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : resultData && resultData?.length > 0 ? (
                  resultData?.map((student) => {
                    return (
                      <tr key={student.id} className="hover:bg-gray-50 border">
                        <td className="flex justify-between items-center px-4 py-2 text-xs md:text-sm lg:text-base">
                          <span>{student.rank || "—"}</span>
                          {student.rank === 1 && (
                            <span className="text-yellow-500" title="مدال طلا">
                              🥇
                            </span>
                          )}
                          {student.rank === 2 && (
                            <span className="text-gray-500" title="مدال نقره">
                              🥈
                            </span>
                          )}
                          {student.rank === 3 && (
                            <span className="text-orange-500" title="مدال برنز">
                              🥉
                            </span>
                          )}
                        </td>
                        <td className="border px-4 py-2 text-xs md:text-sm lg:text-base">
                          {student.fullName}
                        </td>
                        <td className="flex gap-1 items-center justify-center px-4 py-2">
                          {userData?.role === "admin" ||
                          userData?.role === "teacher" ? (
                            <div className="flex gap-1 items-center justify-center">
                              {editValue === student.id ? (
                                <>
                                  <Button
                                    variant="outline"
                                    className="w-7 h-7 md:w-9 md:h-9"
                                    onClick={() =>
                                      handleScoreChange(student.id)
                                    }
                                    disabled={updateScorePending}
                                  >
                                    {updateScorePending ? (
                                      <Loader2 className="animate-spin w-4 h-4 text-gray-500" />
                                    ) : (
                                      <Check className="w-4 h-4 text-gray-500" />
                                    )}
                                  </Button>

                                  <Input
                                    ref={(input) => {
                                      if (editValue === student.id && input) {
                                        input.focus();
                                      }
                                    }}
                                    type="number"
                                    step="0.25"
                                    max={20}
                                    className="w-16 h-7 md:w-20 md:h-9 text-center disabled:opacity-100"
                                    value={scoreValue || ""}
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      if (!isNaN(value) && value <= 20) {
                                        setScoreValue(value);
                                      } else if (value > 20) {
                                        setScoreValue(20);
                                      } else {
                                        setScoreValue(null);
                                      }
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    className="w-7 h-7 md:w-9 md:h-9"
                                    onClick={() => {
                                      setEditValue(null);
                                      setScoreValue(null);
                                    }}
                                    disabled={updateScorePending}
                                  >
                                    <X className="w-4 h-4 text-gray-500" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    className="w-7 h-7 md:w-9 md:h-9"
                                    onClick={() => {
                                      setScoreValue(student.score);
                                      setEditValue(student.id);
                                    }}
                                    disabled={deletingStudentId === student.id}
                                  >
                                    <Edit className="w-4 h-4 text-gray-500" />
                                  </Button>
                                  <Input
                                    className="w-16 h-7 md:w-20 md:h-9 text-center disabled:opacity-100"
                                    disabled
                                    value={student?.score || "_"}
                                  />
                                  <Button
                                    variant="outline"
                                    className="w-7 h-7 md:w-9 md:h-9"
                                    onClick={() =>
                                      handleDeleteStudentScore(student.id)
                                    }
                                    disabled={deletingStudentId === student.id}
                                  >
                                    {deletingStudentId === student.id ? (
                                      <Loader2 className="animate-spin w-4 h-4 text-gray-500" />
                                    ) : (
                                      <Trash className="w-4 h-4 text-gray-500" />
                                    )}
                                  </Button>
                                </>
                              )}
                            </div>
                          ) : student.score !== null ? (
                            student.score
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 border">
                      <span className="text-xs md:text-sm lg:text-base">
                        هیچ داده‌ای برای نمایش وجود ندارد.
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ResultdetailPage;
