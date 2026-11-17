import PolicyPage from "@/components/PolicyPage";
import { POLICIES } from "@/lib/policies";

export const metadata = { title: "Terms and conditions | ChoClo" };

export default function TermsPage() {
  return <PolicyPage policy={POLICIES.terms} />;
}