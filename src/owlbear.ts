import OBR from "@owlbear-rodeo/sdk";
import type {
  OwlbearPlayerRole,
  OwlbearRoomState,
  ValidatedRollBroadcast,
  ValidatedRollSummary,
} from "./types";

const LOCAL_ROOM_STATE_KEY_PREFIX = "owlbear-loot-room-state";
const LOCAL_ROOM_STATE_EVENT = "owlbear-loot-room-state-change";
const LANGUAGE_STORAGE_KEY = "owlbear-loot-language";
const VALIDATED_ROLL_CHANNEL = "io.github.quentin.loot-tables/validated-roll";
const VALIDATED_ROLL_MODAL_ID = "io.github.quentin.loot-tables/validated-roll-modal";

function getLocalRoomStateKey(): string {
  let roomId = "unknown";

  try {
    roomId = OBR.room.id ?? "unknown";
  } catch {
    // Owlbear may not be ready yet. Fall back to an isolated local key.
  }

  return `${LOCAL_ROOM_STATE_KEY_PREFIX}:${roomId}`;
}

function getCurrentLanguage(): "fr" | "en" {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "fr";
  } catch {
    return "fr";
  }
}

function localizeLegacyRollNotification(message: string): string {
  if (getCurrentLanguage() !== "en") {
    return message;
  }

  let localized = message;

  if (localized.startsWith("a validé un tirage")) {
    localized = localized.replace("a validé un tirage", "A roll was validated");
  } else {
    localized = localized.replace(" a validé un tirage", " validated a roll");
  }

  return localized.replace("aucun objet trouvé.", "no item found.");
}

export function waitForOwlbearReady(): Promise<void> {
  return new Promise((resolve) => {
    if (OBR.isReady) {
      resolve();
      return;
    }

    OBR.onReady(() => {
      resolve();
    });
  });
}

export async function configureOwlbearAction(): Promise<void> {
  await OBR.action.setWidth(1150);
  await OBR.action.setHeight(950);
  await OBR.action.setTitle("Loot Tables");
}

export async function setOwlbearPopoverWidth(width: number): Promise<void> {
  try {
    await OBR.action.setWidth(width);
  } catch (error) {
    console.error("Impossible de redimensionner le popover Owlbear :", error);
  }
}

export async function getOwlbearRoomId(): Promise<string | null> {
  try {
    return OBR.room.id ?? null;
  } catch (error) {
    console.error("Impossible de lire l'identifiant de room Owlbear :", error);
    return null;
  }
}

export async function getOwlbearPlayerName(): Promise<string | null> {
  try {
    const name = await OBR.player.getName();
    return typeof name === "string" ? name : null;
  } catch (error) {
    console.error("Impossible de lire le nom du joueur Owlbear :", error);
    return null;
  }
}

export async function getOwlbearPlayerRole(): Promise<OwlbearPlayerRole> {
  try {
    const role = await OBR.player.getRole();

    if (role === "GM" || role === "PLAYER") {
      return role;
    }

    return "UNKNOWN";
  } catch (error) {
    console.error("Impossible de lire le rôle Owlbear :", error);
    return "UNKNOWN";
  }
}

export async function getRoomState(): Promise<OwlbearRoomState> {
  try {
    const rawState = localStorage.getItem(getLocalRoomStateKey());

    if (!rawState) {
      return {};
    }

    const state = JSON.parse(rawState) as unknown;

    if (!state || typeof state !== "object") {
      return {};
    }

    return state as OwlbearRoomState;
  } catch (error) {
    console.error("Impossible de lire l'état local de Loot Tables :", error);
    return {};
  }
}

export async function setRoomState(
  partialState: Partial<OwlbearRoomState>
): Promise<void> {
  try {
    const currentState = await getRoomState();
    const nextState: OwlbearRoomState = {
      ...currentState,
      ...partialState,
    };

    localStorage.setItem(getLocalRoomStateKey(), JSON.stringify(nextState));
    window.dispatchEvent(
      new CustomEvent<OwlbearRoomState>(LOCAL_ROOM_STATE_EVENT, {
        detail: nextState,
      })
    );
  } catch (error) {
    console.error("Impossible d'écrire l'état local de Loot Tables :", error);
  }
}

export function subscribeToRoomState(
  callback: (state: OwlbearRoomState) => void
): () => void {
  const localStateKey = getLocalRoomStateKey();

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== localStateKey) {
      return;
    }

    void getRoomState().then(callback);
  };

  const handleLocalChange = (event: Event) => {
    const customEvent = event as CustomEvent<OwlbearRoomState>;
    callback(customEvent.detail ?? {});
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCAL_ROOM_STATE_EVENT, handleLocalChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCAL_ROOM_STATE_EVENT, handleLocalChange);
  };
}

export async function notifyInfo(message: string): Promise<void> {
  try {
    await OBR.notification.show(localizeLegacyRollNotification(message), "INFO");
  } catch (error) {
    console.error("Impossible d'afficher une notification Owlbear :", error);
  }
}

export async function notifySuccess(message: string): Promise<void> {
  try {
    await OBR.notification.show(localizeLegacyRollNotification(message), "SUCCESS");
  } catch (error) {
    console.error("Impossible d'afficher une notification Owlbear :", error);
  }
}

export async function publishValidatedRoll(
  summary: ValidatedRollSummary
): Promise<void> {
  try {
    // The validating GM receives the modal locally.
    await openValidatedRollModal(summary);

    const message: ValidatedRollBroadcast = {
      type: "validated-roll",
      payload: summary,
    };

    // A validated roll is ephemeral room communication, so use Broadcast
    // instead of room metadata. REMOTE avoids sending the same event back
    // to the validating GM, who already opened the modal above.
    await OBR.broadcast.sendMessage(VALIDATED_ROLL_CHANNEL, message, {
      destination: "REMOTE",
    });
  } catch (error) {
    console.error("Impossible d'envoyer le tirage validé :", error);
  }
}

export function subscribeToValidatedRolls(
  callback: (summary: ValidatedRollSummary) => void
): () => void {
  return OBR.broadcast.onMessage(VALIDATED_ROLL_CHANNEL, (event) => {
    const data = event.data as ValidatedRollBroadcast | undefined;

    if (!data || data.type !== "validated-roll") {
      return;
    }

    callback(data.payload);
  });
}

export async function openValidatedRollModal(
  summary: ValidatedRollSummary
): Promise<void> {
  try {
    // Keep the payload local to this browser so the modal iframe can read it.
    // No Owlbear room metadata is used for validated rolls.
    await setRoomState({
      lastValidatedRoll: summary,
    });

    try {
      await OBR.modal.close(VALIDATED_ROLL_MODAL_ID);
    } catch {
      // ignore
    }

    const viewportMax =
      typeof window !== "undefined"
        ? Math.max(320, window.innerHeight - 32)
        : 980;

    const headerFooterSpace = 170;
    const perItemHeight = 84;

    const computedHeight = Math.min(
      Math.max(320, headerFooterSpace + summary.items.length * perItemHeight),
      viewportMax
    );

    const language = getCurrentLanguage();
    const modalUrl = `https://thp21000.github.io/loot-tables-for-OBR/?view=gain-modal&lang=${language}`;

    await OBR.modal.open({
      id: VALIDATED_ROLL_MODAL_ID,
      url: modalUrl,
      width: 760,
      height: computedHeight,
    });
  } catch (error) {
    console.error("Impossible d'ouvrir la modale de gain Owlbear :", error);
  }
}

export async function closeValidatedRollModal(): Promise<void> {
  try {
    await OBR.modal.close(VALIDATED_ROLL_MODAL_ID);
  } catch (error) {
    console.error("Impossible de fermer la modale de gain Owlbear :", error);
  }
}
