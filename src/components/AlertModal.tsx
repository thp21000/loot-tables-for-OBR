import Modal from "./Modal";
import { buttons } from "../styles/ui";

type AlertModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
};

const REDUNDANT_SHARED_ROLL_MESSAGES = new Set([
  "Tirage validé et partagé à tous.",
  "Roll validated and shared with everyone.",
]);

export default function AlertModal({
  isOpen,
  title,
  message,
  buttonLabel = "OK",
  onClose,
}: AlertModalProps) {
  const normalizedMessage = message.trim();

  // The shared-loot modal already confirms a validated roll, so avoid
  // stacking an additional generic information modal for the same action.
  if (
    !isOpen ||
    !normalizedMessage ||
    REDUNDANT_SHARED_ROLL_MESSAGES.has(normalizedMessage)
  ) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={
        <button onClick={onClose} style={buttons.primary}>
          {buttonLabel}
        </button>
      }
    >
      <p style={{ margin: 0, textAlign: "center", lineHeight: 1.6 }}>
        {message}
      </p>
    </Modal>
  );
}
