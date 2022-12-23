import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { EncryptionService } from "../encryption/encryption.service";

@Injectable({
  providedIn: "root",
})
export class ConfigurationService {
  private apiURL: String = environment.apiURL;

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {}

  /**
   * Get current configuration from backend
   * @returns Observable request
   */
  getConfiguration() {
    // Set the url to get information
    const url = `${this.apiURL}configuration`;

    // Get configuration
    return this.http.get(url);
  }

  /**
   * Update or create configuration
   * @param configurationData Object with new data
   * @returns Observable request
   */
  saveConfiguration(configurationData: any) {
    // Get formData files
    const formData = this.objectToFormData(configurationData);

    // Save normal object data as encrypted
    formData.append(
      "data",
      this.encryptionService.encrypt(JSON.stringify(configurationData))
    );

    // Set the url
    const url = `${this.apiURL}configuration`;

    // Update configuration
    return this.http.put(url, formData);
  }

  /**
   * Get images from object and append to form as files
   * @param obj Object with files to append
   * @param form current FormData to append
   * @returns formData with the images
   */
  objectToFormData(obj: any, form?: any) {
    var formData = form || new FormData();

    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        // if the property is an object, but not a File, use recursivity.
        if (
          typeof obj[property] === "object" &&
          !(obj[property] instanceof File)
        ) {
          this.objectToFormData(obj[property], formData);
        } else {
          // If the property is a file
          if (obj[property] instanceof File) {
            // Image file to form data
            formData.append(property, obj[property]);
          }
        }
      }
    }

    return formData;
  }
}
