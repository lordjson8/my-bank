// src/services/deviceService.ts
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Application from "expo-application";

class DeviceService {
  getDeviceId(): string {
    return Application.applicationId || "unknown-device-id";
  }

  getDeviceName(): string {
    return Device.deviceName || this.getDefaultDeviceName();
  }

  getDefaultDeviceName(): string {
    return Device.modelName || Device.deviceName || "Unknown Device";
  }

  getDeviceType(): "ios" | "android" {
    return Platform.OS === "ios" ? "ios" : "android";
  }

  getDeviceInfo() {
    return {
      device_id: this.getDeviceId(),
      device_name: this.getDeviceName(),
      device_type: this.getDeviceType(),
    };
  }
}

export default new DeviceService();
