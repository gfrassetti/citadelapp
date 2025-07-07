"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";

export default function ContactVendorModal({ open, onClose, contact }) {
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contactar a {contact.companyName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          {contact.whatsapp && (
            <div className="flex items-center gap-2">
             <Image src="/whatsapp.webp" alt="WhatsApp" width={30} height={30} />
              <a
                href={`https://wa.me/${contact.whatsapp.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {contact.whatsapp}
              </a>
            </div>
          )}
          {contact.email && (
            <div>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contact.email}`} className="text-blue-600 underline">
                {contact.email}
              </a>
            </div>
          )}
          {contact.phone && (
            <div>
              <strong>Teléfono:</strong>{" "}
              <a href={`tel:${contact.phone}`} className="text-blue-600 underline">
                {contact.phone}
              </a>
            </div>
          )}
        </div>
        <DialogFooter>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cerrar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}