import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ResumeData, ShoppingItem } from "../backend";
import { useActor } from "./useActor";

export function useGetResume() {
  const { actor, isFetching } = useActor();
  return useQuery<ResumeData | null>({
    queryKey: ["resume"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getResume();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ResumeData) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.saveResume(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
  });
}

export function useIsPaid(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isPaid", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return false;
      return actor.isPaid(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 30_000,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: Array<ShoppingItem>;
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useVerifySession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error("Not authenticated");
      const status = await actor.getStripeSessionStatus(sessionId);
      if (status.__kind__ === "completed") {
        return true;
      }
      return false;
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["isPaid"] });
      }
    },
  });
}

export function useRecordRazorpayPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentId: string) => {
      if (!actor) throw new Error("Not authenticated");
      // Cast to any since recordRazorpayPayment is added at runtime by the canister
      return (actor as any).recordRazorpayPayment(
        paymentId,
      ) as Promise<boolean>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isPaid"] });
    },
  });
}
