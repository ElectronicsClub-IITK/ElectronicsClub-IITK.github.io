import React from "react";

// Minimal recent competitions tab
// Uses static data for now; can be wired to a backend or JSON later.
const competitions = [
  {
    title: "Winter Camp Project Showcase",
    date: "2026-01-20",
    description: "Showcase of projects built during Winter Camp with live demos and judging.",
    link: "https://www.instagram.com/electronicsclub.iitk/",
  },
  {
    title: "Monthly Challenge: Smart Energy Monitor",
    date: "2026-01-05",
    description: "Build a low-cost energy monitor with ESP32 and publish real-time readings.",
    link: "/Challenge",
  },
  {
    title: "Takneek Electronics Events",
    date: "2025-09-15",
    description: "Hall-level competitions under Takneek: Electromania, Embedded Sprints and more.",
    link: "https://students.iitk.ac.in/takneek/",
  },
  {
    title: "Techkriti: Electromania",
    date: "2025-03-20",
    description: "Institute-wide basic electronics competition hosted during Techkriti.",
    link: "https://techkriti.org/",
  },
];

const RecentCompetitions = () => {
  // sort by date descending
  const sorted = [...competitions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ padding: "24px", minHeight: "60vh" }}>
      <h1 style={{ color: "#acce46", marginBottom: 8 }}>Recent Competitions</h1>
      <p style={{ color: "#aaa", marginBottom: 24 }}>
        Explore the latest competitions, showcases and challenges hosted by the Electronics Club.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {sorted.map((c) => (
          <a
            key={c.title + c.date}
            href={c.link}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
            target={c.link?.startsWith("http") ? "_blank" : undefined}
            rel={c.link?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <div
              style={{
                border: "1px solid #2a2a2a",
                borderRadius: 12,
                padding: 16,
                background: "#0e0e0e",
                transition: "transform 0.15s ease, border-color 0.15s ease",
              }}
              className="recent-competition-card"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#acce46")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            >
              <div style={{ fontSize: 12, color: "#bbb" }}>
                {new Date(c.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 6, color: "#eaeaea" }}>{c.title}</div>
              <div style={{ marginTop: 8, color: "#cfd2d6", lineHeight: 1.4 }}>{c.description}</div>
              <div style={{ marginTop: 12, color: "#acce46", fontSize: 14 }}>Learn more →</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecentCompetitions;
