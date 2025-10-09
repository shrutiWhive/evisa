import QRCode from "react-qr-code";

export function CampaignQRCode({ campaignFormLink, size }) {
  return <QRCode value={campaignFormLink} size={size} />;
}
