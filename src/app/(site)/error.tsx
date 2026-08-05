"use client";

import { useEffect } from "react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const cmsDown = error.name === "CmsUnavailableError";

  return (
    <div className="page">
      <section className="section">
        <div className="shell">
          <p className="eyebrow">Chyba</p>
          <h1 className="section-title">
            {cmsDown ? "Obsah je dočasne nedostupný" : "Niečo sa pokazilo"}
          </h1>
          <p className="section-lead">
            {cmsDown
              ? "Nepodarilo sa načítať turnaje a médiá. Skús obnoviť stránku o chvíľu."
              : "Obnov stránku. Ak problém pretrváva, ozvi sa cez kontakt."}
          </p>
          <button className="btn btn--primary" type="button" onClick={reset}>
            Skúsiť znova
          </button>
        </div>
      </section>
    </div>
  );
}
