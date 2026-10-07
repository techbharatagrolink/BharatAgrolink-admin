import { notFound } from "next/navigation";
import { ScreenView } from "@/components/screens/screen-view";
import { getPhpScreen } from "@/lib/php-screens";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const screen = getPhpScreen(slug);
  return { title: screen?.title ?? "Not found" };
}

export default async function PhpScreenPage({ params }) {
  const { slug } = await params;
  const screen = getPhpScreen(slug);
  if (!screen) notFound();
  return <ScreenView screen={screen} />;
}
