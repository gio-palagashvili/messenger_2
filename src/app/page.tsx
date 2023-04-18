import Link from "next/link";
import { Inter } from "next/font/google";
import Button from "@/components/ui/Button";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Link href="/home">
        <Button>go home</Button>
      </Link>
    </div>
  );
}
