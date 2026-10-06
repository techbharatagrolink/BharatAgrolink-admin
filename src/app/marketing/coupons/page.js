import ComingSoon from "@/components/coming-soon";

export const metadata = { title: "Coupons" };

export default function CouponsPage() {
  return (
    <ComingSoon
      title="Coupons"
      description="Coupon management is not available in this panel yet."
      backHref="/marketing"
      backLabel="Back to Campaigns"
    />
  );
}
