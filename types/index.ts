import { ImagePickerAsset } from "expo-image-picker";

export type InfoFormFields = "name" | "surname" | "dateOfBirth" | "address";

export type InfoType = {
  firstname: { value: string};
  lastname: { value: string};
  address: { value: string};
  id: { value: ImagePickerAsset | null};
  date: { value: Date | null};
  selfie: { value: ImagePickerAsset | null};
};

