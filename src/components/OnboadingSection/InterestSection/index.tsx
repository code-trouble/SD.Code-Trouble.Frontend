import { useTags } from "../../../queries/tags";
import { TagBadge } from "../../TagBadge";
import { SectionContainer } from "../SectionContainer";
import { useOnboardingStore } from "../../../stores/onboardingStore";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../../queries/user";

export const InterestSection = () => {
  const { data: tags = [] } = useTags();
  const { interestTagIds, setInterests } = useOnboardingStore();
  const currentUser = useCurrentUser();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.user_interests && !isInitialized) {
      const existingInterestIds = new Set<number>(
        currentUser.user_interests.map((userInterest) => userInterest.tag_id),
      );
      setInterests(existingInterestIds);
      setIsInitialized(true);
    }
  }, [currentUser, isInitialized, setInterests]);

  const handleTagToggle = (tagId: number) => {
    const newActiveIds = new Set(interestTagIds);

    if (newActiveIds.has(tagId)) {
      newActiveIds.delete(tagId);
    } else {
      newActiveIds.add(tagId);
    }

    setInterests(newActiveIds);
  };

  return (
    <>
      <SectionContainer
        sectionTitle="Selecione seus interesses."
        sectionDescription="Escolha seus principais interesses, posts aparecerão para você com base no que escolher."
        sectionContent={
          <div className="interest-tags tag-list">
            {tags.map((tag) => {
              const isActive = interestTagIds.has(tag.id);

              return (
                <TagBadge
                  key={tag.id}
                  tag={tag}
                  isActive={isActive}
                  onClick={handleTagToggle}
                />
              );
            })}
          </div>
        }
      />
    </>
  );
};
