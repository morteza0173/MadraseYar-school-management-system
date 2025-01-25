import { ResponsiveModal } from "../Responsive-modal";
import AddGradeForm from "./AddGradeForm";

const AddGrade = ({
  isOpen,
  setIsOpen,
  close,
  title,
  discription,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  close: () => void;
  title: string;
  discription:string;
}) => {
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={title}
      discription={discription}
    >
      <AddGradeForm onCancel={close} />
    </ResponsiveModal>
  );
};
export default AddGrade
