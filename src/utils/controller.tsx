import { useEffect, type ReactElement } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "./api";

export const Controller = ({ children }: { children: ReactElement }) => {
  const { mutate: userMutation } = api.user.upsertUser.useMutation();

  const { user, isSignedIn, isLoaded } = useUser();

  const { data: userData } = api.user.getUserByExternalId.useQuery(
    {
      externalUserId: user?.id ?? "",
    },
    {
      enabled: !!user?.id,
    }
  );

  useEffect(() => {
    if (!userData?.id && user?.id && isSignedIn && isLoaded) {
      console.warn("Upserting User!");
      userMutation({
        externalId: user.id,
        emailAddress: user?.primaryEmailAddress?.emailAddress ?? "",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        avatar: user?.profileImageUrl ?? "",
        userIdentities: user?.externalAccounts?.map((account) => ({
          provider: account.provider,
          providerId: account.providerUserId,
        })),
      });
    }
  }, [userData, user, isSignedIn, isLoaded, userMutation]);

  return children;
};

export default Controller;
