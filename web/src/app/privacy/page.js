import PolicyPage from "@/components/PolicyPage";
import { POLICIES } from "@/lib/policies";

export const metadata = { title: "Privacy policy | ChoClo" };

export default function PrivacyPage() {
  return <PolicyPage policy={POLICIES.privacy} />;
}