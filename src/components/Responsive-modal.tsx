import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  discription?: string;
}

export const ResponsiveModal = ({
  children,
  onOpenChange,
  open,
  title,
  discription,
}: ResponsiveModalProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]"
          dir="rtl"
        >
          <DialogHeader className="m-4">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{discription}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent dir="rtl">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{discription}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto hide-scrollbar max-h-[65vh] overflow-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
