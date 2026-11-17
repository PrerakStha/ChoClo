import PolicyPage from "@/components/PolicyPage";
import { POLICIES } from "@/lib/policies";

export const metadata = { title: "Refunds and cancellation | ChoClo" };

export default function RefundsPage() {
  return <PolicyPage policy={POLICIES.refunds} />;
}