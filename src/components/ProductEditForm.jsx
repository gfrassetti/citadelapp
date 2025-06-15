import {
    Alert,
    AlertTitle,
    AlertDescription,
  } from "@/components/ui/alert";
  import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  
  export default function ProductEditForm({
    form,
    loading,
    selectedProduct,
    setSelectedProduct,
    handleDelete,
    onSubmit,
    status,
  }) {
    return (
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
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la Imagen</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
  
            <div className="flex items-center gap-2">
              <Button type="submit">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
  
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(selectedProduct.id)}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
  
            {status && (
              <Alert variant={status.type === "error" ? "destructive" : "default"}>
                <AlertTitle>{status.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </div>
    );
  }
  