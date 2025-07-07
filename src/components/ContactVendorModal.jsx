"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";

export default function ContactVendorModal({ open, onClose, product }) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contactar al vendedor</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {product.whatsapp && (
            <div className="flex items-center gap-2">
              <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={20} height={20} />
              <a
                href={`https://wa.me/${product.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {product.whatsapp}
              </a>
            </div>
          )}

          {product.email && (
            <div>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${product.email}`} className="text-blue-600 underline">
                {product.email}
              </a>
            </div>
          )}

          {product.phone && (
            <div>
              <strong>Teléfono:</strong>{" "}
              <a href={`tel:${product.phone}`} className="text-blue-600 underline">
                {product.phone}
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
