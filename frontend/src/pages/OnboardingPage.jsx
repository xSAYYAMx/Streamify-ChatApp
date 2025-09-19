import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { LoaderIcon } from "react-hot-toast";
import { CameraIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formstate, setFormstate] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formstate);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png `

    setFormstate({...formstate, profilePic: randomAvatar});
    toast.success("Random profile pic generated!")
  };

  return (
    <div className="min-h-screen bg-base-100 flex  items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile pic container */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formstate.profilePic ? (
                  <img
                    src={formstate.profilePic}
                    alt="Profile Prevuew"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate random avatar button */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={formstate.fullName}
                onChange={(e) =>
                  setFormstate({ ...formstate, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your Full Name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formstate.bio}
                onChange={(e) =>
                  setFormstate({ ...formstate, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label-text">Native Language</label>
                <select
                  name="nativelanguage"
                  value={formstate.nativeLanguage}
                  onChange={(e) =>
                    setFormstate({
                      ...formstate,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option
                      key={`native-${lang}`}
                      value={lang.toLocaleUpperCase()}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label-text">Learning Language</label>
                <select
                  name="learninglanguage"
                  value={formstate.learningLanguage}
                  onChange={(e) =>
                    setFormstate({
                      ...formstate,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option
                      key={`learning-${lang}`}
                      value={lang.toLocaleUpperCase()}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formstate.location}
                  onChange={(e) =>
                    setFormstate({ ...formstate, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending? (
                <>
                <ShipWheelIcon className="size-5 mr-2" />
                Complete Onboarding
                </>
              ) : (
                <>
                <LoaderIcon className="animate-spin size-5 mr-2" />
                Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
