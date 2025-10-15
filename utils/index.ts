import { InfoType } from "@/types";

export const validateInfo = (
  info: InfoType,
  setInfo: (info: InfoType) => void,
  errors: string[],
  setErrors: (errors: string[]) => void
) => {
  if (info.lastname.value.length === 0) {
    setErrors([...errors, (errors[0] = "Surname Required")]);
  } else {
    setErrors([...errors, (errors[0] = "")]);
  }

  if (info.firstname.value.length === 0) {
    setErrors([...errors, (errors[1] = "Firstname Required")]);
  } else {
    setErrors([...errors, (errors[1] = "")]);
  }

  if (info.date.value == null) {
    setErrors([...errors, (errors[2] = "Date Required")]);
  } else {
    setErrors([...errors, (errors[2] = "")]);
  }

  if (info.address.value.length === 0) {
    setErrors([...errors, (errors[3] = "Address Required")]);
  } else {
    setErrors([...errors, (errors[3] = "")]);
  }

  if (info.id.value == null) {
    setErrors([...errors, (errors[4] = "Id Required")]);
  } else {
    setErrors([...errors, (errors[4] = "")]);
  }

  if (info.selfie.value == null) {
    setErrors([...errors, (errors[6] = "Selfie Required")]);
  } else {
    setErrors([...errors, (errors[6] = "")]);
  }
};
