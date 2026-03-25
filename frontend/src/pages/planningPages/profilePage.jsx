import "./profilePage.css";
import { useEffect, useState } from "react";
import profileImage from "../../assets/profile-img/my-profile.png";
import editProfileImage from "../../assets/profile-img/edit-profile.png";
import passwordImage from "../../assets/profile-img/password.png";
import preferencesImage from "../../assets/profile-img/preferences.png";
import pastTripsImage from "../../assets/profile-img/map_869173 1.png";
import upcomingTripsImage from "../../assets/profile-img/plane_5207646 1.png";
import friend1Image from "../../assets/profile-img/friend1.png";
import friend2Image from "../../assets/profile-img/friend2.png";
import friend3Image from "../../assets/profile-img/friend3.png";

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const formatPhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return value || "(123) 456-7890";
};

const formatDateOfBirth = (value) => {
  if (!value) return "01 / 02 / 2000";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).replace(/\//g, " / ");
};

const buildProfileSummary = (user) => ({
  name: user?.name || user?.fullName || user?.username || "Nomadiq Traveler",
  email: user?.email || "traveler@example.com",
  cell: formatPhone(
    user?.phone || user?.cell || user?.phoneNumber || user?.mobileNumber || ""
  ),
  dateOfBirth: formatDateOfBirth(
    user?.dob || user?.birthDate || user?.birthday || user?.dateOfBirth || ""
  ),
});

const FRIEND_ROWS = [
  { label: "Friend 1", status: "On a trip", image: friend1Image },
  { label: "Friend 2", status: "Planning", image: friend2Image },
  { label: "Friend 3", status: "Just returned", image: friend3Image },
];

const SETTINGS_ITEMS = [
  { label: "Edit Profile", icon: editProfileImage },
  { label: "Change Password", icon: passwordImage },
  { label: "Preferences", icon: preferencesImage },
];

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [tripInfo, setTripInfo] = useState(null);

  useEffect(() => {
    setUser(parseStoredJson("user"));
    setTripInfo(parseStoredJson("plan"));
  }, []);

  const profile = buildProfileSummary(user);
  const destinationText =
    tripInfo?.destination?.city ||
    tripInfo?.city ||
    tripInfo?.destination?.country ||
    tripInfo?.country ||
    "Upcoming";

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <section className="profile-top-grid">
          <div className="profile-card">
            <div className="profile-avatar-wrap">
              <img src={profileImage} alt="Profile" className="profile-avatar-image" />
            </div>

            <div className="profile-copy">
              <h1>{profile.name}</h1>

              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Cell:</strong> {profile.cell}
              </p>
              <p>
                <strong>Date of Birth:</strong> {profile.dateOfBirth}
              </p>
            </div>
          </div>

          <aside className="profile-settings-card">
            <h2>Account Settings</h2>

            <div className="profile-settings-list">
              {SETTINGS_ITEMS.map((item) => (
                <button type="button" className="profile-setting-button" key={item.label}>
                  <span className="profile-setting-left">
                    <img src={item.icon} alt="" className="profile-setting-icon" />
                    <span>{item.label}</span>
                  </span>
                  <span className="profile-setting-chevron" aria-hidden="true" />
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="profile-bottom-grid">
          <div className="profile-trips-card">
            <h2>My Trips</h2>

            <div className="profile-trips-grid">
              <button type="button" className="profile-trip-tile">
                <img src={pastTripsImage} alt="" className="profile-trip-image" />
                <span>Past</span>
              </button>

              <button type="button" className="profile-trip-tile">
                <img src={upcomingTripsImage} alt="" className="profile-trip-image" />
                <span>Upcoming</span>
                <small>{destinationText}</small>
              </button>
            </div>
          </div>

          <div className="profile-friends-card">
            <div className="profile-friends-header">
              <h2>My Friends</h2>
              <button type="button" className="profile-add-friend-button" aria-label="Add friend">
                +
              </button>
            </div>

            <div className="profile-friends-list">
              {FRIEND_ROWS.map((friend) => (
                <div className="profile-friend-row" key={friend.label}>
                  <img src={friend.image} alt="" className="profile-friend-image" />
                  <p>
                    <strong>{friend.label}:</strong> {friend.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
