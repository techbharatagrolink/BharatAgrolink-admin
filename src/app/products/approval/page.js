import ComingSoon from "@/components/coming-soon";

export const metadata = { title: "Product Approval" };

export default function ProductApprovalPage() {
  return (
    <ComingSoon
      title="Product Approval"
      description="A dedicated approval workflow is not available yet. The listing approval queue is shown on the All Products page."
      backHref="/products"
      backLabel="Go to All Products"
    />
  );
}
