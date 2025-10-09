// src/hooks/useDeviceIdentifier.js
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { v4 as uuidv4 } from "uuid";

export function useDeviceIdentifier() {
  const [deviceInfo, setDeviceInfo] = useState({
    device_uuid: null,
    fingerprint: null,
  });

  useEffect(() => {
    async function detectUser() {
      let deviceUUID = localStorage.getItem("device_uuid");
      if (!deviceUUID) {
        deviceUUID = uuidv4();
        localStorage.setItem("device_uuid", deviceUUID);
      }

      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const fingerprintId = result.visitorId;

      setDeviceInfo({
        device_uuid: deviceUUID,
        fingerprint: fingerprintId,
      });
    }

    detectUser();
  }, []);

  return deviceInfo;
}
