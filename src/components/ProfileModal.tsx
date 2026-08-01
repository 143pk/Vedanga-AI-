import React, { useState } from "react";
import { User, Calendar, Clock, X, Save, Sparkles } from "lucide-react";
import { UserProfile } from "../types";
import { LocationInput } from "./LocationInput";

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const [name, setName] = useState(user.name);
  const [dob, setDob] = useState(user.dob);
  const [tob, setTob] = useState(user.tob);
  const [pob, setPob] = useState(user.pob);
  const [gender, setGender] = useState(user.gender);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      dob,
      tob,
      pob,
      gender,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-amber-300 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Edit Birth Profile
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5 text-xs text-slate-200">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase">
                Time of Birth
              </label>
              <input
                type="time"
                required
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 outline-none"
              />
            </div>
          </div>

          <div>
            <LocationInput
              value={pob}
              onChange={(formatted) => setPob(formatted)}
              label="Place of Birth (GPS Accurate)"
              placeholder="Search City, Town, or Country..."
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Save Profile Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
