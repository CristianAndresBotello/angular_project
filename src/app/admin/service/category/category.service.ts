import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

import { map } from "rxjs";
import { EncryptionService } from "../encryption/encryption.service";
import {
  CategoryList,
  CategoryStatus,
  UrlParameters,
} from "../../model/category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiURL: String = environment.apiURL;

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {}

  /**
   * Return the form encrypted data to send to the backend
   *
   * @param formData Object with form data
   * @returns Object with encrypted data
   */
  getFormData(formData: object) {
    return { data: this.encryptionService.encrypt(JSON.stringify(formData)) };
  }

  /**
   * Get a single category information
   *
   * @param categoryId Identification number
   * @returns Observable request
   */
  getCategory(categoryId: number) {
    // Set the url to get information
    const url = `${this.apiURL}category/${categoryId}`;

    // Get category
    return this.http.get(url);
  }

  /**
   * Get category list
   *
   * @returns
   */
  getCategoryList(parameters: UrlParameters) {
    const encryptedData = this.getFormData(parameters);
    // Prepare parameters
    let params = new HttpParams({ fromObject: encryptedData as any });

    // Set the url to get information
    let url = this.apiURL + "category/list";

    return this.http.get<CategoryList[]>(url, { params }).pipe(
      // Map data to change date format
      map((data: any) => {
        // Update date
        const updatedList = data.list.map((category: CategoryList) => {
          return {
            ...category,
            created_at: new Date(category.created_at).toLocaleDateString(
              "en-US"
            ),
            updated_at: new Date(category.updated_at).toLocaleDateString(
              "en-US"
            ),
          };
        });

        return { ...data, list: updatedList };
      })
    );
  }

  /**
   * Update category information
   *
   * @param categoryId Identification number
   * @param modifiedCategory Object with modified information
   * @returns Observable request
   */
  updateCategory(categoryId: number, modifiedCategory: any) {
    // Set the url
    const url = `${this.apiURL}category/${categoryId}`;

    // Update category
    return this.http.put(url, this.getFormData(modifiedCategory));
  }

  /**
   * Create a new category
   *
   * @param newCategory Object with new category information
   * @returns Observable request
   */
  createCategory(newCategory: {}) {
    // Set the url
    const url = `${this.apiURL}category`;

    // Create category
    return this.http.post(url, this.getFormData(newCategory));
  }

  /**
   * It does not delete the category just updates the category state
   *
   * @param categoryId Identification number
   * @returns
   */
  deleteCategory(categoryId: string) {
    // Set the url
    const url = `${this.apiURL}category/${categoryId}`;

    const formData = { status: CategoryStatus.deleted };

    // Update category
    return this.http.put(url, this.getFormData(formData));
  }
}
