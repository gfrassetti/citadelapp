"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/db/db";
import { toast } from "sonner";
import ProductEditForm from "@/components/ProductEditForm";
import { DataTable } from "@/components/ui/data-table";
import { columns as baseColumns } from "@/components/Columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function EditProduct() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const selectedRowIds = Object.keys(rowSelection);
  const form = useForm();
  const router = useRouter();

  useEffect(() => {
    if (!user?.empresaId) return;
    async function fetchProducts() {
      const q = query(
        collection(db, "products"),
        where("empresaId", "==", user.empresaId)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
      setInitialLoading(false);
    }
    fetchProducts();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      toast.error("No se pudo eliminar el producto");
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      await Promise.all(
        selectedRowIds.map((id) => deleteDoc(doc(db, "products", id)))
      );
      setProducts((prev) => prev.filter((p) => !selectedRowIds.includes(p.id)));
      setRowSelection({});
      toast.success("Productos eliminados correctamente");
    } catch (error) {
      console.error("Error eliminando múltiples productos:", error);
      toast.error("No se pudieron eliminar los productos");
    } finally {
      setBulkDeleting(false);
      setShowConfirm(false);
    }
  };

  const theme = useTheme().theme;

  const columns = baseColumns({
    onSelect: () => {},
    showImage: true,
    disableLink: true,
    rowClickable: true,
    enableSelection: true,
  });

  return (
    <div className="p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Editar productos</h2>
        <Separator />
        {initialLoading ? (
          <Skeleton className="w-full h-[300px] rounded-md" />
        ) : (
          <>
            {selectedRowIds.length > 0 && (
              <div className="flex justify-end mb-4">
                <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Eliminar seleccionados</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar productos seleccionados?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará los productos seleccionados permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBulkDelete}
                        disabled={bulkDeleting}
                      >
                        {bulkDeleting ? "Eliminando..." : "Confirmar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            <DataTable
              columns={columns}
              data={products}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              onRowClick={(product) =>
                router.push(`/dashboard/product/${product.id}`)
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
