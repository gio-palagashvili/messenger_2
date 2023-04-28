import { FC } from "react";
import Toast from "@/components/ui/Toast";

interface HandleToastProps {
  error: ToastError | null;
  complete: string | null;
}

const HandleToast: FC<HandleToastProps> = ({ error, complete }) => {
  return (
    <>
      {error && <Toast error={{ text: `${error.text}` }} variant={"error"} />}
      {complete && <Toast variant={"success"} completeMessage={complete} />}
    </>
  );
};

export default HandleToast;
