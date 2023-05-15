import { mockBootApi } from "./mock";
import { GoogleDriveBootApi } from "./shared";

export { type AsyncFile, type TokenInfo } from "./shared";

export const bootApi = (): GoogleDriveBootApi => {
  // TODO
  return mockBootApi;
};
