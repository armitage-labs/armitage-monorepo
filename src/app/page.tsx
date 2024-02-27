"use client";
import { redirect, useRouter } from "next/navigation";

export default async function Home() {
  redirect("/overview");
}
