import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MyClient from "./MyClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My subscription — Korvex",
};

interface Props {
  searchParams: { token?: string };
}

export default function MyPage({ searchParams }: Props) {
  const token = searchParams.token ?? "";
  return (
    <>
      <Navbar />
      <main className="px-4 pb-20 pt-28">
        <div className="mx-auto max-w-xl">
          <h1 className="font-heading text-3xl font-black text-korvex-text">
            My subscription
          </h1>
          <div className="mt-6">
            <MyClient token={token} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
