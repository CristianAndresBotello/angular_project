import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmDialogComponent } from "../../core/confirm-dialog/confirm-dialog.component";

interface ButtonOptions {
  text: string;
  class?: string;
}

@Injectable({ providedIn: "root" })
export class ConfirmDialogService {
  constructor(private modalService: NgbModal) {}

  public confirm(
    title: string,
    message: string,
    btnOk?: ButtonOptions,
    btnCancel?: ButtonOptions,
    modalOptions?: {}
  ): Promise<boolean> {
    // Reference to the ngbmodal
    const modalRef = this.modalService.open(
      ConfirmDialogComponent,
      modalOptions
    );

    // Set values to the confirm component
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOk?.text || "Ok";
    modalRef.componentInstance.btnCancelText = btnCancel?.text || "Cancel";
    modalRef.componentInstance.btnOkClass = btnOk?.class || "btn-danger";
    modalRef.componentInstance.btnCancelClass =
      btnCancel?.class || "btn-outline-secondary";

    // Return the user response
    return modalRef.result;
  }
}
