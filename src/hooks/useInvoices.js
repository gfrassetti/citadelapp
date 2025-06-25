import { useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext";

export function useInvoices() {
  const { user } = useUser();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    fetch("/api/stripe/invoices", {
      headers: { "x-user-id": user.uid },
    })
      .then(res => res.json())
      .then(data => setInvoices(data.invoices || []))
      .finally(() => setLoading(false));
  }, [user?.uid]);

  return { invoices, loading };
}