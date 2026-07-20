import { useOnboardingStore } from "../../../stores/onboardingStore";
import { useCurrentUser } from "../../../queries/user";
import { ProfileImages } from "../../profileImages";
import { SectionContainer } from "../SectionContainer";

export const ProfileDetailsSection = () => {
  const currentUser = useCurrentUser();
  const { profileDetails, updateProfileDetail } = useOnboardingStore();

  const pronounOptions = [
    { value: "", label: "Prefiro não dizer" },
    { value: "Ele/Dele", label: "Ele/Dele" },
    { value: "Ela/Dela", label: "Ela/Dela" },
    { value: "Elu/Delu", label: "Elu/Delu" },
    { value: "any", label: "Qualquer Pronome" },
  ];

  return (
    <>
      <SectionContainer
        sectionTitle="Detalhes do perfil"
        sectionDescription="Insira detalhes para completar seu perfil."
        sectionContent={
          <div className="profile-details">
            <h2>Foto & Capa de perfil</h2>
            <ProfileImages />
            <div className="profile-form">
              <div className="input-group">
                <label htmlFor="nomeDePerfil">Nome de perfil</label>
                <input
                  name="nomeDePerfil"
                  type="text"
                  placeholder="seu nome completo"
                  value={profileDetails.display_name}
                  onChange={(e) =>
                    updateProfileDetail("display_name", e.target.value)
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="nomeDeUsuario">Nome de usuário</label>
                <input
                  name="nomeDeUsuario"
                  type="text"
                  placeholder={currentUser?.username || "ex: joana1234"}
                  value={currentUser?.username}
                  disabled={true}
                />
              </div>

              <div className="input-group">
                <label htmlFor="pronouns">Pronomes</label>
                <select
                  id="pronouns"
                  name="pronouns"
                  value={profileDetails.pronouns}
                  onChange={(e) =>
                    updateProfileDetail("pronouns", e.target.value)
                  }
                >
                  {pronounOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="biografia">Biografia</label>
                <textarea
                  placeholder="Placeholder"
                  name="biografia"
                  value={profileDetails.bio}
                  onChange={(e) => updateProfileDetail("bio", e.target.value)}
                />
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};
