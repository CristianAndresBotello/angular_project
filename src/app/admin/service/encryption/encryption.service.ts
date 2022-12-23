import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class EncryptionService {
  secretKey: string = environment.ENCRYPTION_KEY;
  secretIv: string = environment.ENCRYPTION_IV;

  constructor() {}

  encrypt(text: string) {
    return this.encryptAES256(text, this.secretKey, this.secretIv);
  }

  decrypt(text: string) {
    return this.decryptAES256(text, this.secretKey, this.secretIv);
  }

  /**
   * Encrypt all values inside the object
   *
   * @param textObject Object
   * @return Encrypted object
   */
  encryptObject(textObject: {}) {
    return Object.fromEntries(
      Object.entries(textObject).map(([key, value]) => [
        key,
        this.encrypt(value as string),
      ])
    );
  }

  /**
   * Decrypt all values inside the object
   *
   * @param textObject Object
   * @return Decrypted object
   */
  decryptObject(textObject: {}) {
    return Object.fromEntries(
      Object.entries(textObject).map(([key, value]) => [
        key,
        this.decrypt(value as string),
      ])
    );
  }

  encryptAES256(text: string, key: string, iv: string) {
    let _key = CryptoJS.enc.Utf8.parse(key);
    let _iv = CryptoJS.enc.Utf8.parse(iv);
    let encrypted = CryptoJS.AES.encrypt(text, _key, {
      iv: _iv,
      format: CryptoJS.format.Hex,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    }).toString();

    return encrypted;
  }

  decryptAES256(encryptedText: string, key: string, iv: string) {
    let _key = CryptoJS.enc.Utf8.parse(key);
    let _iv = CryptoJS.enc.Utf8.parse(iv);
    let decrypted = CryptoJS.AES.decrypt(encryptedText, _key, {
      iv: _iv,
      format: CryptoJS.format.Hex,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    }).toString(CryptoJS.enc.Utf8);

    return decrypted;
  }
}
