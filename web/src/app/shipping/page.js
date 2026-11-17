import PolicyPage from "@/components/PolicyPage";
import { POLICIES } from "@/lib/policies";

export const metadata = { title: "Shipping policy | ChoClo" };

export default function ShippingPage() {
  return <PolicyPage policy={POLICIES.shipping} />;
}