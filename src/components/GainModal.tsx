import Modal from "./Modal";
import type { OwlbearPlayerRole, ValidatedRollSummary } from "../types";
import { buttons, colors, radius } from "../styles/ui";
import { useI18n } from "../i18n";
import { tCategory, tCurrency, tRarity } from "../i18n/gameTerms";

type GainModalProps = {
  isOpen: boolean;
  summary: ValidatedRollSummary | null;
  onClose: () => void;
  playerRole: OwlbearPlayerRole;
};

function getRarityColor(rarity: string): string {
  if (rarity === "Aucun") return "#9ca3af";
  if (rarity === "Courant") return "#9ca3af";
  if (rarity === "Peu courant") return "#f59e0b";
  if (rarity === "Rare") return "#60a5fa";
  if (rarity === "Très rare") return "#2c68b1";
  if (rarity === "Légendaire") return "#00ff00";
  if (rarity === "Unique") return "#a78bfa";
  if (rarity === "Artéfact") return "#a78bfa";
  return "#a78bfa";
}

export default function GainModal({
  isOpen,
  summary,
  onClose,
  playerRole,
}: GainModalProps) {
  const { t, language } = useI18n();

  if (!isOpen || !summary) {
    return null;
  }

  const isFrench = language === "fr";
  const title = playerRole === "GM" ? t("gain.shared") : t("gain.discovered");
  const sharingMessage =
    playerRole === "GM"
      ? summary.validatedBy
        ? isFrench
          ? `Tu as partagé ce tirage en tant que ${summary.validatedBy}`
          : `You shared this roll as ${summary.validatedBy}`
        : isFrench
          ? "Tu as partagé ce tirage"
          : "You shared this roll"
      : summary.validatedBy
        ? isFrench
          ? `${summary.validatedBy} a validé ce tirage`
          : `${summary.validatedBy} validated this roll`
        : isFrench
          ? "Un tirage a été validé"
          : "A roll was validated";

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={
        <button onClick={onClose} style={buttons.primary}>
          {t("common.close")}
        </button>
      }
    >
      <div style={{ display: "grid", gap: "14px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>
            {summary.tableName}
          </div>
          <div style={{ color: colors.textMuted, marginTop: "6px" }}>
            {sharingMessage}
          </div>
          <div style={{ color: colors.textMuted, marginTop: "4px" }}>
            {new Date(summary.validatedAt).toLocaleString(
              language === "fr" ? "fr-FR" : "en-GB"
            )}
          </div>
        </div>

        {summary.items.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: colors.textSoft,
              padding: "10px",
              border: `1px solid ${colors.borderSoft}`,
              borderRadius: radius.md,
              background: colors.panelBg,
            }}
          >
            {t("gain.noItem")}
          </div>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {summary.items.map((item, index) => (
              <div
                key={`${summary.validatedAt}-${item.name}-${index}`}
                style={{
                  border: `1px solid ${colors.borderSoft}`,
                  borderRadius: radius.md,
                  padding: "12px",
                  background: colors.cardBgAlt,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: colors.textMuted }}>
                    {item.valueAmount} {tCurrency(item.valueCurrency, language)}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginTop: "8px",
                    color: colors.textSoft,
                  }}
                >
                  <span>
                    {t("column.level")} {item.level}
                  </span>
                  <span>{tCategory(item.category, language)}</span>
                  <span
                    style={{
                      color: getRarityColor(item.rarity),
                      fontWeight: 700,
                    }}
                  >
                    {tRarity(item.rarity, language)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
