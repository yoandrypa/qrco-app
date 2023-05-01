import Notifications from "../../../notifications/Notifications";

interface CopiedProp {
  setCopied: (copied: boolean) => void;
  message?: string;
}

export default function RenderCopiedNotification({setCopied, message}: CopiedProp) {
  return (
    <Notifications
      autoHideDuration={2500}
      message={message || "Copied!"}
      vertical="bottom"
      horizontal="center"
      severity="success"
      onClose={() => setCopied(false)}/>
  );
}
