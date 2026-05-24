import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { UnansweredCard } from "@/components/admin/UnansweredCard";
import { getUnansweredForAdmin } from "@/lib/unanswered/queries";

export const metadata = {
  title: "Câu hỏi chưa trả lời — Dế Mèn Admin",
  robots: { index: false, follow: false },
};

export default async function AdminUnansweredPage() {
  const items = await getUnansweredForAdmin();
  const pending = items.filter((i) => !i.answer).length;
  const answered = items.filter((i) => i.answer && !i.mergedToKb).length;
  const merged = items.filter((i) => i.mergedToKb).length;

  return (
    <main className="py-10">
      <Container size="narrow">
        <header className="mb-6">
          <Link href="/admin" className="text-xs text-[color:var(--color-primary-dark)] hover:underline">
            ← Trang quản trị
          </Link>
          <h1 className="mt-1 text-3xl font-extrabold">Câu hỏi chờ duyệt</h1>
          <p className="text-sm text-[color:var(--color-text-soft)] mt-1">
            Câu hỏi chatbot không trả lời được. Sau khi trả lời, hãy{" "}
            <strong>copy sang Google Sheet KB</strong> để chatbot tự học cho lần sau.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <StatPill label="Chờ duyệt" value={pending} color="yellow" />
            <StatPill label="Đã trả lời" value={answered} color="blue" />
            <StatPill label="Đã merge KB" value={merged} color="green" />
          </div>
        </header>

        {items.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[color:var(--color-border)] py-16 text-center">
            <p className="text-4xl mb-3">✨</p>
            <p className="text-[color:var(--color-text-soft)]">
              Chưa có câu hỏi nào chờ duyệt.
            </p>
            <p className="mt-2 text-xs text-[color:var(--color-text-soft)]">
              Câu hỏi sẽ xuất hiện ở đây khi chatbot trả lời{" "}
              <code className="px-1 bg-[color:var(--color-primary-bg)] rounded">&quot;chưa có thông tin&quot;</code>.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <UnansweredCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: "yellow" | "blue" | "green" }) {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium ${colors[color]}`}>
      <strong>{value}</strong> {label}
    </span>
  );
}
