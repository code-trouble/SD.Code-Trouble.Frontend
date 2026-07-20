import React, { useState, useRef } from "react";
import {
  imgUploadIcon,
  pfpAddIcon,
  pfpPageBanner,
  fulanoPfp,
} from "../../assets/images/png";
import { useCurrentUser, useUpdateProfile } from "../../queries/user";
import { useImageUpload } from "../../hooks/useImageUpload";
import { cld } from "../../utils/cloudinary";

export const ProfileImages: React.FC = () => {
  const currentUser = useCurrentUser();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingType, setUploadingType] = useState<
    "banner" | "avatar" | null
  >(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const pfpInputRef = useRef<HTMLInputElement>(null);

  // Use the generic hook for banner
  const bannerUpload = useImageUpload({
    onSuccess: async (url) => {
      await updateProfile({ banner_url: url });
      setBannerPreview(null);
    },
    showToast: true,
  });

  // Use the generic hook for avatar
  const avatarUpload = useImageUpload({
    onSuccess: async (url) => {
      await updateProfile({ avatar_url: url });
      setAvatarPreview(null);
    },
    showToast: true,
  });

  const handleBannerChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBannerPreview(URL.createObjectURL(file));
    setUploadingType("banner");

    try {
      await bannerUpload.uploadFile(file, "user-banners");
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingType(null);
    }
  };

  const handlePfpChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploadingType("avatar");

    try {
      await avatarUpload.uploadFile(file, "user-pfps");
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingType(null);
    }
  };

  const displayBanner =
    bannerPreview || cld(currentUser?.banner_url, { w: 1200 }) || pfpPageBanner;
  const displayPfp =
    avatarPreview || cld(currentUser?.avatar_url, { w: 240 }) || fulanoPfp;

  return (
    <div className="banner-pfp">
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={handleBannerChange}
        style={{ display: "none" }}
      />
      <input
        ref={pfpInputRef}
        type="file"
        accept="image/*"
        onChange={handlePfpChange}
        style={{ display: "none" }}
      />

      <div
        className="banner-area"
        onClick={() => bannerInputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <img src={displayBanner} alt="Banner do usuário" className="banner" />
        <img src={imgUploadIcon} alt="Ícone de upload" className="uploadIcon" />
        {uploadingType === "banner" && (
          <div className="spinner-overlay">
            Enviando... {bannerUpload.uploadProgress}%
          </div>
        )}
      </div>

      <div className="pfp-area">
        <img className="pfp-image" src={displayPfp} alt="Foto de perfil" />
        <button
          className="upload-btn pfp-upload"
          type="button"
          onClick={() => pfpInputRef.current?.click()}
          aria-label="Upload profile picture"
        >
          <img
            src={pfpAddIcon}
            alt="Ícone de adicionar foto"
            className="pfp-add-icon"
          />
        </button>
        {uploadingType === "avatar" && (
          <div className="spinner-overlay-pfp">
            Enviando... {avatarUpload.uploadProgress}%
          </div>
        )}
      </div>
    </div>
  );
};
