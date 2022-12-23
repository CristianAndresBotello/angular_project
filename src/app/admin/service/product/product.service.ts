import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  ProductStatus,
  ProductList,
  UrlParameters,
} from "../../model/product.model";
import { map } from "rxjs";
import { EncryptionService } from "../encryption/encryption.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
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
   * Encrypt data avoiding images files then builds a multipart form data
   *
   * @param formObject Object with form data
   * @returns Object with multipar form data
   */
  getMultipartFormData(formObject: any) {
    const encryptedData = this.encryptionService.encrypt(
      JSON.stringify(formObject)
    );

    // Set user form to send
    const formData = new FormData();
    formData.append("data", encryptedData);

    // Look for images files
    if (formObject.images) {
      // Append images files
      formObject.images.map((image: any) => {
        // Just append images files
        if (typeof image.file === "object") {
          formData.append(`image-${image.index}`, image.file);
        }
      });
    }

    return formData;
  }

  /**
   * Get a single product information
   *
   * @param productId Identification number
   * @returns Observable request
   */
  getProduct(productId: number) {
    // Set the url to get information
    const url = `${this.apiURL}product/${productId}`;

    // Get product
    return this.http.get(url);
  }

  /**
   * Get category list
   *
   * @returns
   */
  getProductList(parameters: UrlParameters) {
    const encryptedData = this.getFormData(parameters);
    // Prepare parameters
    let params = new HttpParams({ fromObject: encryptedData as any });

    // Set the url to get information
    let url = this.apiURL + "product/list";

    return this.http.get<ProductList[]>(url, { params }).pipe(
      // Map data to change date format
      map((data: any) => {
        // Update date
        const updatedList = data.list.map((product: ProductList) => {
          return {
            ...product,
            created_at: new Date(product.created_at).toLocaleDateString(
              "en-US"
            ),
            updated_at: new Date(product.updated_at).toLocaleDateString(
              "en-US"
            ),
          };
        });

        return { ...data, list: updatedList };
      })
    );
  }

  /**
   * Update product information
   *
   * @param productId Identification number
   * @param modifiedProduct Object with modified information
   * @returns Observable request
   */
  updateProduct(productId: number, modifiedProduct: any) {
    // Set the url
    const url = `${this.apiURL}product/${productId}`;

    // Update product
    return this.http.put(url, this.getMultipartFormData(modifiedProduct));
  }

  /**
   * Create a new product
   *
   * @param newProduct Object with new product information
   * @returns Observable request
   */
  createProduct(productInformation: {}) {
    // Set the url
    const url = `${this.apiURL}product`;

    // Create product
    return this.http.post(url, this.getMultipartFormData(productInformation));
  }

  /**
   * It does not delete the product just updates the product state
   *
   * @param productId Identification number
   * @returns
   */
  deleteProduct(productId: string) {
    // Set the url
    const url = `${this.apiURL}product/${productId}`;

    const formData = { status: ProductStatus.deleted };

    // Update product
    return this.http.put(url, this.getMultipartFormData(formData));
  }
}
