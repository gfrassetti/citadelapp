"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/db/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

export default function EditProduct() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      tags: "",
    },
  });

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
    }
    fetchProducts();
  }, [user]);

  const onSelectProduct = (product) => {
    setSelectedProduct(product);
    form.reset({
      productName: product.productName,
      description: product.description,
      price: product.price,
      tags: product.tags?.join(", ") || "",
    });
  };

  const onSubmit = async (values) => {
    if (!selectedProduct) return;
    setLoading(true);
    setStatus(null);

    const updatedData = {
      productName: values.productName,
      description: values.description,
      price: values.price,
      tags: values.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      await updateDoc(doc(db, "products", selectedProduct.id), updatedData);
      setStatus({
        type: "success",
        message: "Producto actualizado correctamente.",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Error al actualizar el producto.",
      });
    } finally {
      setTimeout(() => setStatus(null), 4000);
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {!selectedProduct ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectProduct(product)}

            >
              <img
                src={product.imageUrl}
                alt={product.productName}
                loading="lazy"
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p className="font-semibold">{product.productName}</p>
              <p className="text-sm">{product.description}</p>
              <p className="text-sm text-green-600">💲{product.price}</p>
              <p className="text-xs text-gray-500">
              {product.createdAt?.toDate
                  ? product.createdAt.toDate().toLocaleDateString()
                  : "Sin fecha"}

              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-4">
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => setSelectedProduct(null)}
          >
            ← Volver
          </Button>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palabras clave</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>

              {status && (
                <Alert
                  variant={status.type === "error" ? "destructive" : "default"}
                >
                  <AlertTitle>
                    {status.type === "error" ? "Error" : "Éxito"}
                  </AlertTitle>
                  <AlertDescription>{status.message}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

