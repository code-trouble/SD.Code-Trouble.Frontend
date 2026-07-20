import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import { InterestSection } from "../../components/OnboadingSection/InterestSection";
import { ProfileDetailsSection } from "../../components/OnboadingSection/ProfileDetailsSection";
import { SocialsSection } from "../../components/OnboadingSection/SocialsSection";
import OnboardingStepper from "../../components/Stepper";
import { useOnboardingStore } from "../../stores/onboardingStore";
import {
  useCurrentUser,
  useUpdateInterests,
  useUpdateProfile,
} from "../../queries/user";
import { toast } from "sonner";

export const Onboarding = () => {
  const {
    interestTagIds,
    profileDetails,
    socialLinks,
    resetOnboardingState,
    updateProfileDetail,
    updateSocialLink,
  } = useOnboardingStore();
  const currentUser = useCurrentUser();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { mutateAsync: updateUserInterests } = useUpdateInterests();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (currentUser && !isInitialized) {
      updateProfileDetail("display_name", currentUser.display_name || "");
      updateProfileDetail("pronouns", currentUser.pronouns || "not_specified");
      updateProfileDetail("bio", currentUser.bio || "");

      if (currentUser.social_links) {
        const socialKeys: (keyof typeof currentUser.social_links)[] = [
          "linkedin",
          "github",
          "dribbble",
          "behance",
        ];
        socialKeys.forEach((key) => {
          if (currentUser.social_links && currentUser.social_links[key]) {
            updateSocialLink(key, currentUser.social_links[key] || "");
          }
        });
      }

      setIsInitialized(true);
    }
  }, [currentUser, isInitialized, updateProfileDetail, updateSocialLink]);

  const userHasSelectedTags = interestTagIds.size > 0;

  const userHasFilledProfile = Object.entries(profileDetails).some(
    ([key, value]) =>
      key !== "pronouns" &&
      value !== "" &&
      value !== null &&
      value !== undefined,
  );

  const userHasConnectedSocials = Object.values(socialLinks).some(
    (value) => value !== "" && value !== null && value !== undefined,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const interestsArray = Array.from(interestTagIds);
      const profileData = { ...profileDetails, social_links: socialLinks };
      const cleanProfileData = Object.fromEntries(
        Object.entries(profileData).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const promises = [updateProfile(cleanProfileData)];
      if (interestsArray.length >= 1) {
        promises.push(updateUserInterests(interestsArray));
      }

      await Promise.all(promises);
      toast.success("Perfil salvo com sucesso!");
      resetOnboardingState();
      navigate(`/${currentUser?.username}`);
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar seu perfil. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="onboardingWrapper" onSubmit={handleSubmit}>
      <div className="onboarding-details">
        <div className="onboarding-header">
          <h1>Complete seu perfil</h1>
          <CustomButton
            onClick={() => navigate("/")}
            backgroundColor="#2DBA4F"
            padding="8px 54px"
            text="Preencher Depois"
            borderRadius="8px"
            color="#fff"
            type="button"
          />
        </div>
        <InterestSection />
        <ProfileDetailsSection />
        <SocialsSection />

        <CustomButton
          text={isSubmitting ? "Salvando..." : "Finalizar"}
          padding="8px 135px"
          backgroundColor="#2DBA4F"
          color="white"
          customId="submitButton"
          type="submit"
          disabled={isSubmitting}
        />
      </div>

      <div className="desktop-tracker">
        <OnboardingStepper
          steps={["Interesses", "Detalhes do perfil", "Conecte suas redes"]}
          activeStep={1}
          connectorHeights={[173, 941]}
          hasSelectedTags={userHasSelectedTags}
          hasFilledProfileDetails={userHasFilledProfile}
          hasConnectedSocials={userHasConnectedSocials}
        />
      </div>
    </form>
  );
};
