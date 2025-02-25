import { Adminlogin, Teacherlogin } from "@/actions/loginAction";
import SubmitButton from "@/components/SubmitButton";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

function CardContentUsers({
  value,
  title,
  description,
  loginAction,
}: {
  value: string;
  title: string;
  description: string;
  loginAction?: (formData: FormData) => Promise<void>;
}) {
  return (
    <TabsContent value={value}>
      <Card dir="rtl">
        <CardHeader className="space-y-4">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <form action={loginAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">
                نام کاربری یا شماره موبایل و یا کدملی
              </Label>
              <Input
                id="user"
                name="user"
                className="h-12"
                defaultValue="morteza0173"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">پسورد</Label>
              <Input
                id="password"
                name="password"
                className="h-12"
                defaultValue="morteza"
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="ورود" />
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}

export default function LoginPage() {
  return (
    <div className="flex w-full min-h-screen h-full bg-[#E5E5E5] relative lg:static">
      <div className="rounded-full w-80 h-80 bg-[#DCC920] opacity-30 absolute -top-40 -right-40 z-10 blur-3xl lg:hidden"></div>
      <div className="w-full lg:w-1/2">
        <div className="flex gap-2 items-center p-4">
          <GraduationCap className="size-8" />
          <h2 className="font-semibold">مدرسه یار</h2>
        </div>

        <div className=" rounded-lg bg-[#FFF2F2] bg-opacity-15 backdrop-blur-[7px] flex flex-col gap-4 p-4 lg:hidden">
          <div className="bg-orange-300 w-fit py-2 px-4 rounded-md shadow-md">
            <p className="">آغاز یک مسیر جدید در یادگیری</p>
          </div>
          <div>
            <p className="text-sm">
              در اینجا هر روز فرصتی جدید برای رشد و پیشرفت است. به جمع ما
              بپیوندید و از امکانات بی‌نظیر مدرسه برای ساخت آینده‌ای روشن
              استفاده کنید.
            </p>
          </div>
        </div>

        <div className="w-full flex justify-center my-10">
          <Tabs defaultValue="parent" className="w-full px-2 md:w-96" dir="rtl">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                className="data-[state=active]:bg-orange-200"
                value="parent"
              >
                اولیا
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-orange-200"
                value="student"
              >
                دانش آموز
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-orange-200"
                value="teacher"
              >
                معلم
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-orange-200"
                value="admin"
              >
                مدیر
              </TabsTrigger>
            </TabsList>
            <CardContentUsers
              value="parent"
              title="ورود اولیای محترم"
              description="اولیا گرامی، شما ستون اصلی پیشرفت دانش‌آموزان هستید. با ورود
                    به سیستم، می‌توانید از آخرین اخبار و گزارش‌های پیشرفت
                    فرزندتان مطلع شوید."
            />
            <CardContentUsers
              value="student"
              title="ورود دانش آموز گرامی"
              description="دانش‌آموز عزیز، با ورود به سیستم می‌توانید از وضعیت درسی،
                    تکالیف و نمرات خود مطلع شوید و مسیر پیشرفت خود را بهتر
                    برنامه‌ریزی کنید."
            />
            <CardContentUsers
              value="teacher"
              title="ورود معلم عزیز"
              description="معلم محترم، با ورود به سیستم می‌توانید وضعیت آموزشی
                    دانش‌آموزان را پیگیری کرده و از آخرین فعالیت‌ها و تکالیف
                    آن‌ها مطلع شوید."
              loginAction={Teacherlogin}
            />
            <CardContentUsers
              value="admin"
              title="ورود مدیر محترم"
              description="مدیر محترم، با ورود به سیستم می‌توانید بر فعالیت‌های آموزشی،
                    عملکرد معلمان و وضعیت دانش‌آموزان نظارت داشته باشید و
                    تصمیمات مؤثری برای بهبود کیفیت آموزشی اتخاذ کنید."
              loginAction={Adminlogin}
            />
          </Tabs>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 relative">
        <div className="rounded-full w-80 h-80 bg-[#DCC920] opacity-30 absolute top-5 -right-36 z-10 blur-3xl"></div>
        <div className="absolute w-[90%] h-40 rounded-lg bg-[#FFF2F2] bg-opacity-15 backdrop-blur-[7px]  bottom-7 right-8 z-20 flex flex-col gap-4 p-4">
          <div className="bg-orange-300 w-fit py-2 px-4 rounded-md shadow-md">
            <p className="">آغاز یک مسیر جدید در یادگیری</p>
          </div>
          <div>
            <p className="text-sm">
              در اینجا هر روز فرصتی جدید برای رشد و پیشرفت است. به جمع ما
              بپیوندید و از امکانات بی‌نظیر مدرسه برای ساخت آینده‌ای روشن
              استفاده کنید.
            </p>
          </div>
        </div>
        <Image
          src="/loginBg.png"
          alt="login pic"
          className="w-full h-full object-cover"
          fill
        />
      </div>
    </div>
  );
}
