import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  UserStatus,
  SiteUserList,
  UrlParameters,
} from "../../model/site-user-list.model";
import { map } from "rxjs";
import { EncryptionService } from "../encryption/encryption.service";

@Injectable({ providedIn: "root" })
export class SiteUserService {
  private apiURL: String = environment.apiURL;

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {}

  /**
   * Get a single user user information
   *
   * @param userId Identification number
   * @returns Observable request
   */
  getSiteUser(userId: number) {
    // Set the url to get information
    const url = `${this.apiURL}user/${userId}`;

    // Get user
    return this.http.get(url);
  }

  /**
   * Get user user list
   *
   * @returns
   */
  getSiteUserList(parameters: UrlParameters) {
    // Prepare parameters
    let params = new HttpParams({ fromObject: parameters as any });

    // Set the url to get information
    let url = this.apiURL + "user/list";

    return this.http.get<SiteUserList[]>(url, { params }).pipe(
      // Map data to change date format
      map((data: any) => {
        // Update date
        const updatedList = data.list.map((user: SiteUserList) => {
          return {
            ...user,
            created_at: new Date(user.created_at).toLocaleDateString("en-US"),
            updated_at: new Date(user.updated_at).toLocaleDateString("en-US"),
          };
        });

        return { ...data, list: updatedList };
      })
    );
  }

  /**
   * Update user user information
   *
   * @param userId Identification number
   * @param modifiedUser Object with modified information
   * @returns Observable request
   */
  updateSiteUser(userId: number, modifiedUser: any) {
    // Set the url
    const url = `${this.apiURL}user/${userId}`;

    // Set user form to send
    const formData = new FormData();
    Object.entries(modifiedUser).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    // Encrypt data
    // const encryptedData = this.encryptionService.encrypt(
    //   JSON.stringify(formData)
    // );

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //     Authorization: "my-auth-token",
    //   }),
    // };

    // Update user
    return this.http.put(
      url,
      formData
      // , httpOptions
    );
  }

  /**
   * Create a new user user
   *
   * @param newUser Object with new user information
   * @returns Observable request
   */
  createSiteUser(newUser: {}) {
    // Set the url
    const url = `${this.apiURL}user`;

    // Set user form to send
    const formData = new FormData();
    Object.entries(newUser).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    // Create user
    return this.http.post(url, formData);
  }

  /**
   * It does not delete the user just update the user state
   *
   * @param userId Identification number
   * @returns
   */
  deleteSiteUser(userId: string) {
    // Set the url
    const url = `${this.apiURL}user/${userId}`;

    // Update user
    return this.http.put(url, { status: UserStatus.deleted });
  }
}
