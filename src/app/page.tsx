import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div>
      <Link href="/home">
        <Button>go home</Button>
      </Link>
    </div>
  );
}
