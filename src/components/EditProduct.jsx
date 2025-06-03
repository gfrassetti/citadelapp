import React, { useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/db/db";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function EditProduct() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      const q = query(collection(db, "products"), where("empresaId", "==", user.empresaId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    const updatedData = {
      productName: values.productName,
      description: values.description,
      price: values.price,
      tags: values.tags.split(",").map((tag) => tag.trim()),
    };
    await updateDoc(doc(db, "products", selectedProduct.id), updatedData);
    alert("Producto actualizado correctamente");
  };

  return (
    <div className="p-4">
      {!selectedProduct ? (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 border cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectProduct(product)}
            >
              <p className="font-semibold">{product.productName}</p>
              <p className="text-sm">{product.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palabras clave</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Guardar Cambios</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
