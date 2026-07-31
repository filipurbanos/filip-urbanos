"use client";

import { mediaLinks } from "@/content";
import { useLocale } from "@/lib/locale";
import { useState } from "react";

type CardId = "minimal" | "premium";

export function FlipBusinessCards() {
  const { locale } = useLocale();
  const [flipped, setFlipped] = useState<Record<CardId, boolean>>({
    minimal: false,
    premium: false,
  });

  const role = locale === "sk" ? "Juniorský tenista" : "Junior tennis player";
  const tennis = locale === "sk" ? "TENIS" : "TENNIS";
  const hint =
    locale === "sk" ? "Prejdi myšou / ťukni pre otočenie" : "Hover / tap to flip";

  function toggle(id: CardId) {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className="fu-cards" id="contact">
      <div className="shell">
        <p className="fu-cards__hint">{hint}</p>
        <div className="fu-cards__grid">
          {/* Concept A — sport minimalism */}
          <button
            type="button"
            className={`fu-vcard fu-vcard--minimal ${flipped.minimal ? "is-flipped" : ""}`}
            onClick={() => toggle("minimal")}
            aria-label={
              locale === "sk"
                ? "Vizitka Filip Urbánoš — minimalizmus"
                : "Business card Filip Urbanos — minimal"
            }
          >
            <div className="fu-vcard__inner">
              <div className="fu-vcard__face fu-vcard__face--front">
                <div className="fu-vcard__logo">FU</div>
                <div>
                  <h2>FILIP URBÁNOŠ</h2>
                  <p className="fu-vcard__highlight">{role}</p>
                </div>
              </div>
              <div className="fu-vcard__face fu-vcard__face--back">
                <div className="fu-vcard__accent" aria-hidden="true" />
                <div className="fu-vcard__info">
                  <a
                    href={mediaLinks.email}
                    className="fu-vcard__item"
                    onClick={(e) => e.stopPropagation()}
                  >
                    urbanosfilip33@gmail.com
                  </a>
                  <a
                    href={mediaLinks.instagram}
                    className="fu-vcard__item"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    @filipurbanos
                  </a>
                  <span className="fu-vcard__item">filipurbanos.sk</span>
                  <span className="fu-vcard__item">Slovakia → Florida</span>
                </div>
              </div>
            </div>
          </button>

          {/* Concept B — premium club */}
          <button
            type="button"
            className={`fu-vcard fu-vcard--premium ${flipped.premium ? "is-flipped" : ""}`}
            onClick={() => toggle("premium")}
            aria-label={
              locale === "sk"
                ? "Vizitka Filip Urbánoš — premium"
                : "Business card Filip Urbanos — premium"
            }
          >
            <div className="fu-vcard__inner">
              <div className="fu-vcard__face fu-vcard__face--front fu-vcard__face--lime">
                <div className="fu-vcard__brand">
                  <span className="fu-vcard__big">FU</span>
                  <h2>FILIP URBÁNOŠ</h2>
                  <p>{tennis}</p>
                </div>
              </div>
              <div className="fu-vcard__face fu-vcard__face--back">
                <div className="fu-vcard__split">
                  <div className="fu-vcard__col">
                    <h3>FILIP URBÁNOŠ</h3>
                    <p className="fu-vcard__sub">{role}</p>
                    <a
                      href={mediaLinks.itf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fu-vcard__itf"
                      onClick={(e) => e.stopPropagation()}
                    >
                      itftennis.com ↗
                    </a>
                  </div>
                  <div className="fu-vcard__col fu-vcard__col--right">
                    <a
                      href={mediaLinks.email}
                      className="fu-vcard__item"
                      onClick={(e) => e.stopPropagation()}
                    >
                      urbanosfilip33@gmail.com
                    </a>
                    <a
                      href={mediaLinks.instagram}
                      className="fu-vcard__item"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      @filipurbanos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
