import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  redirect("/home");
};

export default page;
