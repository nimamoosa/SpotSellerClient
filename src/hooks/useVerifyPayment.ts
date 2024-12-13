import { useEffect, useState } from "react";

export default function useVerifyPayment(
  paymentId: string | null,
  verify_token: string | null,
  Authority: string | null,
  Status: string | null
) {
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!paymentId || !verify_token || !Authority || !Status) {
      setLoadingRequest(false);
      setIsError(false);

      return;
    }
  }, []);
}
