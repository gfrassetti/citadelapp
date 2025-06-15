"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function columns({ selected, setSelected }) {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllRowsSelected(!!value)
          }
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "imageUrl",
      header: "Imagen",
      cell: ({ row }) => {
        const src = row.original.imageUrl;
        return (
          <img
            src={src}
            alt=""
            className="w-14 h-14 object-cover rounded"
          />
        );
      },
    },
    {
      accessorKey: "productName",
      header: "Nombre",
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.original.productName;
        return (
          <a
          href={`/product/${id}`}
          className="text-blue-600 hover:underline"
          >
            {name}
          </a>
        );
      },
    },    
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => `💲${row.original.price}`,
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "createdAt",
      header: "Creado",
      cell: ({ row }) => {
        const ts = row.original.createdAt;
        return ts?.toDate ? ts.toDate().toLocaleDateString() : "-";
      },
    },
    
  ];
}
