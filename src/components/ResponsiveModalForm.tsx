import { ResponsiveModal } from "./Responsive-modal";

const ResponsiveModalForm = ({
  children,
  isOpen,
  setIsOpen,
  title,
  discription,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  close: () => void;
  title: string;
  discription: string;
}) => {
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={title}
      discription={discription}
    >
      {children}
    </ResponsiveModal>
  );
};
export default ResponsiveModalForm;
