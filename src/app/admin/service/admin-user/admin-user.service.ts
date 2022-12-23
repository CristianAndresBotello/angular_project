import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  AdminStatus,
  AdminUserList,
  UrlParameters,
} from "../../model/admin-user-list.model";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdminUserService {
  private apiURL: String = environment.apiURL;

  constructor(private http: HttpClient) {}

  /**
   * Get a single admin user information
   *
   * @param adminId Identification number
   * @returns Observable request
   */
  getAdminUser(adminId: number) {
    // Set the url to get information
    const url = `${this.apiURL}admin/${adminId}`;

    // Get user
    return this.http.get(url);
  }

  /**
   * Get admin user list
   *
   * @returns
   */
  getAdminUserList(parameters: UrlParameters) {
    // Prepare parameters
    let params = new HttpParams({ fromObject: parameters as any });

    // Set the url to get information
    let url = this.apiURL + "admin/list";

    return this.http.get<AdminUserList[]>(url, { params }).pipe(
      // Map data to change date format
      map((data: any) => {
        // Update date
        const updatedList = data.list.map((admin: AdminUserList) => {
          return {
            ...admin,
            admuse_created_at: new Date(
              admin.admuse_created_at
            ).toLocaleDateString("en-US"),
            admuse_updated_at: new Date(
              admin.admuse_updated_at
            ).toLocaleDateString("en-US"),
          };
        });

        return { ...data, list: updatedList };
      })
    );
  }

  /**
   * Update admin user information
   *
   * @param adminId Identification number
   * @param modifiedAdmin Object with modified information
   * @returns Observable request
   */
  updateAdminUser(adminId: number, modifiedAdmin: {}) {
    // Set the url
    const url = `${this.apiURL}admin/${adminId}`;

    // Update user
    return this.http.put(url, modifiedAdmin);
  }

  /**
   * Create a new admin user
   *
   * @param newAdmin Object with new admin information
   * @returns Observable request
   */
  createAdminUser(newAdmin: {}) {
    // Set the url
    const url = `${this.apiURL}admin`;

    // Create user
    return this.http.post(url, newAdmin);
  }

  /**
   * It does not delete the user just update the user state
   *
   * @param adminId Identification number
   * @returns
   */
  deleteAdminUser(adminId: string) {
    // Set the url
    const url = `${this.apiURL}admin/${adminId}`;

    // Update user
    return this.http.put(url, { status: AdminStatus.deleted });
  }
}
