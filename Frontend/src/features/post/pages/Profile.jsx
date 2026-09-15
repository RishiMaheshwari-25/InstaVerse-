import React, { useCallback, useEffect, useState } from "react";
import "../style/profile.scss";
import "../style/community.scss";
import "../style/post-management.scss";
import "../style/saved-posts.scss";
import Nav from "../shared/components/Nav";
import { useAuth } from "../../auth/hooks/useAuth";
import { followUser, getConnections, getDiscoverUsers, getMyProfile, unfollowUser, updateMyProfile, uploadProfileImage } from "../services/profile.api";
import { deletePost, getSavedPosts } from "../services/post.api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ bio: "", profileImage: "" });
  const [people, setPeople] = useState([]);
  const [connectionModal, setConnectionModal] = useState(null);
  const [connections, setConnections] = useState([]);
  const [followingName, setFollowingName] = useState("");
  const [deletingPostId, setDeletingPostId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);

  const refreshProfile = useCallback(async () => {
    const [profileData, peopleData, savedData] = await Promise.all([getMyProfile(), getDiscoverUsers(), getSavedPosts()]);
    setProfile(profileData);
    setPeople(peopleData.users);
    setSavedPosts(savedData.posts);
    setForm({ bio: profileData.user.bio || "", profileImage: profileData.user.profileImage || "" });
  }, []);

  useEffect(() => { refreshProfile().catch(() => setError("We couldn't load your profile right now.")); }, [refreshProfile]);

  const profileUser = profile?.user || user;
  const username = profileUser?.username || "yourname";
  const profileImage = profileUser?.profileImage;
  const bio = profileUser?.bio || "Creating memories, sharing stories, and finding beauty in the everyday.";
  const stats = profile?.stats || { posts: 0, followers: 0, following: 0 };
  const posts = profile?.posts || [];
  const formatCount = (count) => count >= 1000 ? `${(count / 1000).toFixed(1).replace(".0", "")}k` : count;

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true); setError("");
    try {
      let data = await updateMyProfile(imageFile ? { bio: form.bio } : form);
      if(imageFile) data = await uploadProfileImage(imageFile);
      setProfile((current) => ({ ...current, user: data.user }));
      setUser(data.user);
      setImageFile(null);
      setIsEditing(false);
    } catch {
      setError("Your changes could not be saved. Please try again.");
    } finally { setIsSaving(false); }
  };

  const handleToggleFollow = async (person) => {
    setFollowingName(person.username); setError("");
    try {
      if (person.isFollowing) await unfollowUser(person.username);
      else await followUser(person.username);
      await refreshProfile();
    } catch { setError("That follow action could not be completed. Please try again."); }
    finally { setFollowingName(""); }
  };

  const handleOpenConnections = async (type) => {
    setConnectionModal(type); setConnections([]); setError("");
    try { const data = await getConnections(type); setConnections(data.users); }
    catch { setError("We couldn't load that list right now."); }
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm("Delete this post permanently? This cannot be undone.")) return;
    setDeletingPostId(post._id); setError("");
    try {
      await deletePost(post._id);
      setProfile((current) => ({
        ...current,
        posts: current.posts.filter((item) => item._id !== post._id),
        stats: { ...current.stats, posts: Math.max(0, current.stats.posts - 1) }
      }));
    } catch { setError("This post could not be deleted. Please try again."); }
    finally { setDeletingPostId(""); }
  };

  return <main className="profile-page">
    <Nav variant="profile" />
    <section className="profile-shell">
      <div className="profile-hero">
        <div className="hero-orb hero-orb--one" /><div className="hero-orb hero-orb--two" />
        <div className="profile-intro">
          <div className="avatar-ring">
            {profileImage ? <img src={profileImage} alt={`${username}'s profile`} /> : <span>{username.charAt(0).toUpperCase()}</span>}
            <i className="online-dot" aria-label="Active now" />
          </div>
          <div className="profile-copy">
            <div className="profile-heading"><div><p className="eyebrow">YOUR SPACE</p><h1>@{username}</h1></div><button className="edit-profile" onClick={() => setIsEditing(true)} type="button">Edit profile <span>↗</span></button></div>
            <p className="profile-bio">{bio}</p>
            <div className="profile-meta"><span>✦ {profileUser?.email || "Earth, somewhere beautiful"}</span><span className="availability"><i /> Open to connect</span></div>
          </div>
        </div>
        <div className="profile-stats" aria-label="Profile statistics"><div><strong>{stats.posts}</strong><span>posts</span></div><button onClick={() => handleOpenConnections("followers")} type="button"><strong>{formatCount(stats.followers)}</strong><span>followers</span></button><button onClick={() => handleOpenConnections("following")} type="button"><strong>{formatCount(stats.following)}</strong><span>following</span></button></div>
      </div>
      <section className="community-section" aria-labelledby="community-title">
        <div className="content-heading"><div><p className="eyebrow">THE INSTAVERSE COMMUNITY</p><h2 id="community-title">People to follow</h2></div><span className="post-total">{people.length} creators</span></div>
        <div className="people-grid">
          {people.map((person) => <article className="person-card" key={person._id}><div className="person-avatar">{person.profileImage ? <img src={person.profileImage} alt="" /> : <span>{person.username.charAt(0).toUpperCase()}</span>}</div><div className="person-details"><h3>@{person.username}</h3><p>{person.bio || "New creator on InstaVerse"}</p><small>{formatCount(person.followers)} followers</small></div><button className={person.isFollowing ? "following-button" : "follow-button"} onClick={() => handleToggleFollow(person)} disabled={followingName === person.username} type="button">{followingName === person.username ? "Working..." : person.isFollowing ? "Following" : "Follow"}</button></article>)}
          {profile && people.length === 0 && <p className="no-people">No other profiles yet. Invite friends to begin your community.</p>}
        </div>
      </section>
      <div className="profile-content">
        <div className="content-heading"><div><p className="eyebrow">VISUAL DIARY</p><h2>Recent moments</h2></div><span className="post-total">{profile ? `${stats.posts} published` : "Loading posts..."}</span></div>
        {error && <p className="profile-error">{error}</p>}
        {posts.length > 0 && <div className="post-manager"><p>Manage your posts</p>{posts.map((post, index) => <button onClick={() => handleDeletePost(post)} disabled={deletingPostId === post._id} type="button" key={`delete-${post._id}`}>{deletingPostId === post._id ? "Deleting..." : `Delete post ${index + 1}`}</button>)}</div>}
        <div className="post-gallery">{posts.map((post, index) => <article className="gallery-card gallery-card--live" key={post._id}><img src={post.img_url} alt={post.caption || `Post ${index + 1}`} /><span className="post-number">0{index + 1}</span><div className="gallery-card__overlay"><span>✦</span><p>{post.caption || "A moment from my visual diary"}</p></div></article>)}</div>
        {profile && posts.length === 0 && <div className="empty-posts"><span>✦</span><h3>Your story starts here.</h3><p>Share your first post and it will appear in this visual diary.</p></div>}
      </div>
      <section className="saved-posts-section" aria-labelledby="saved-posts-title">
        <div className="content-heading"><div><p className="eyebrow">YOUR PRIVATE COLLECTION</p><h2 id="saved-posts-title">Saved posts</h2></div><span className="post-total">{savedPosts.length} saved</span></div>
        <div className="saved-posts-grid">{savedPosts.map((post) => <article className="saved-post-card" key={post._id}><img src={post.img_url} alt={post.caption || "Saved post"} /><div><strong>@{post.user?.username || "creator"}</strong><p>{post.caption || "Saved from your feed"}</p></div></article>)}</div>
        {profile && savedPosts.length === 0 && <p className="no-saved-posts">Posts you save from the feed will live here for you.</p>}
      </section>
    </section>
    {isEditing && <label className="profile-file-picker">Upload profile photo from device<input accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] || null)} type="file" /><span>{imageFile ? imageFile.name : "Choose image"}</span></label>}
    {isEditing && <div className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title"><form onSubmit={handleSave}><button className="close-modal" onClick={() => setIsEditing(false)} type="button" aria-label="Close">×</button><p className="eyebrow">PERSONALIZE YOUR SPACE</p><h2 id="edit-profile-title">Edit profile</h2><label>Bio<textarea value={form.bio} maxLength="160" onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell your story..." /></label><label>Profile image URL<input value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} placeholder="https://..." /></label><p className="character-count">{form.bio.length}/160</p><button className="save-profile" disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save changes"}</button></form></div>}
    {connectionModal && <div className="edit-modal connections-modal" role="dialog" aria-modal="true" aria-labelledby="connections-title"><div className="connections-panel"><button className="close-modal" onClick={() => setConnectionModal(null)} type="button" aria-label="Close">x</button><p className="eyebrow">YOUR NETWORK</p><h2 id="connections-title">{connectionModal === "followers" ? "Followers" : "Following"}</h2><div className="connection-list">{connections.map((person) => <div className="connection-row" key={person._id}><div className="person-avatar">{person.profileImage ? <img src={person.profileImage} alt="" /> : <span>{person.username.charAt(0).toUpperCase()}</span>}</div><div><strong>@{person.username}</strong><p>{person.bio || "InstaVerse creator"}</p></div></div>)}{connections.length === 0 && <p className="no-people">No {connectionModal} yet.</p>}</div></div></div>}
  </main>;
};

export default Profile;
