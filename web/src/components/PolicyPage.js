import { SHOP } from "@/lib/policies";

export default function PolicyPage({ policy }) {
  return (
    <main className="container policy">
      <h1 className="page-title">{policy.title}</h1>
      <p className="policy-updated">Last updated: {SHOP.updated}</p>
      <p className="policy-intro">{policy.intro}</p>

      {policy.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs?.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {section.items && (
            <ul>
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}