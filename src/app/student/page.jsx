'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Github, 
  Linkedin, 
  Globe, 
  Award, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  Camera,
  Plus,
  Trash2
} from 'lucide-react';

// Sample profile data
const sampleProfile = {
  uid: "Y1EzpOflBVTcRrugjowvuFDG2tq2",
  displayName: "Arun Kumar",
  email: "727723eucs090@skcet.ac.in",
  phoneNumber: "+91 9876543210",
  role: "student",
  profile: {
    avatar: null,
    bio: "Passionate about web development and machine learning. Always eager to learn new technologies and contribute to innovative projects.",
    college: "Sri Krishna College of Engineering and Technology",
    location: "Coimbatore, Tamil Nadu",
    githubUrl: "https://github.com/arun-kumar",
    linkedinUrl: "https://linkedin.com/in/arun-kumar",
    portfolioUrl: "https://arun-portfolio.com",
    skills: ["React", "Node.js", "Python", "Machine Learning", "JavaScript", "MongoDB", "Express.js", "TensorFlow"]
  },
  stats: {
    badgesEarned: 5,
    points: 1250,
    sessionsAttended: 12,
    volunteeringHours: 25,
    projectsCompleted: 8,
    rank: 15
  },
  verification: {
    adminApproved: true,
    emailVerified: true,
    phoneVerified: true
  },
  achievements: [
    { title: "Top Performer", description: "Ranked in top 10% of students", date: "2024-08", icon: "star" },
    { title: "Community Champion", description: "25+ hours of volunteering", date: "2024-07", icon: "award" },
    { title: "Skill Master", description: "Completed 5 skill certifications", date: "2024-06", icon: "trending" }
  ],
  recentActivity: [
    { action: "Completed JavaScript Advanced Course", date: "2 days ago", type: "course" },
    { action: "Attended Web Development Workshop", date: "1 week ago", type: "event" },
    { action: "Earned React Certification", date: "2 weeks ago", type: "achievement" },
    { action: "Joined Machine Learning Study Group", date: "3 weeks ago", type: "group" }
  ]
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(sampleProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate data loading and trigger entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = () => {
    setEditForm({
      displayName: profile.displayName,
      bio: profile.profile.bio,
      location: profile.profile.location,
      githubUrl: profile.profile.githubUrl,
      linkedinUrl: profile.profile.linkedinUrl,
      portfolioUrl: profile.profile.portfolioUrl,
      skills: [...profile.profile.skills]
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      displayName: editForm.displayName,
      profile: {
        ...prev.profile,
        bio: editForm.bio,
        location: editForm.location,
        githubUrl: editForm.githubUrl,
        linkedinUrl: editForm.linkedinUrl,
        portfolioUrl: editForm.portfolioUrl,
        skills: editForm.skills
      }
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const addSkill = () => {
    if (editForm.skills.length < 12) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, '']
      }));
    }
  };

  const removeSkill = (index) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index, value) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const getAchievementIcon = (iconType) => {
    switch (iconType) {
      case 'star': return <Star className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      case 'trending': return <TrendingUp className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'course': return <Award className="w-4 h-4 text-blue-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-green-500" />;
      case 'achievement': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'group': return <Users className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200" onClick={() => window.history.back()}>
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className={`bg-white rounded-lg border border-gray-200 p-8 mb-6 transform transition-all duration-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  {profile.profile.avatar ? (
                    <img
                      src={profile.profile.avatar}
                      alt={profile.displayName}
                      className="w-24 h-24 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-transform duration-300 group-hover:scale-105">
                      {profile.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  {!isEditing ? (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.displayName}</h1>
                      <p className="text-gray-600 mb-4 max-w-2xl leading-relaxed">{profile.profile.bio}</p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editForm.displayName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                        className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors duration-200"
                      />
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        rows="3"
                        className="w-full text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phoneNumber}</span>
                    </div>
                    {(profile.profile.location || isEditing) && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        {!isEditing ? (
                          <span>{profile.profile.location}</span>
                        ) : (
                          <input
                            type="text"
                            value={editForm.location || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                            className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none transition-colors duration-200"
                            placeholder="Location"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 transform transition-all duration-700 delay-100 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {[
              { label: 'Points', value: profile.stats.points.toLocaleString(), icon: TrendingUp, color: 'orange' },
              { label: 'Badges', value: profile.stats.badgesEarned, icon: Award, color: 'purple' },
              { label: 'Sessions', value: profile.stats.sessionsAttended, icon: Calendar, color: 'blue' },
              { label: 'Rank', value: `#${profile.stats.rank}`, icon: Star, color: 'yellow' }
            ].map((stat, index) => (
              <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className={`bg-white rounded-lg border border-gray-200 mb-6 transform transition-all duration-700 delay-200 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'achievements', label: 'Achievements' },
                  { id: 'activity', label: 'Recent Activity' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">College</span>
                          <span className="font-medium text-gray-900">{profile.profile.college}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Role</span>
                          <span className="font-medium text-gray-900 capitalize">{profile.role}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Volunteering Hours</span>
                          <span className="font-medium text-gray-900">{profile.stats.volunteeringHours}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Projects Completed</span>
                          <span className="font-medium text-gray-900">{profile.stats.projectsCompleted}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                      <div className="space-y-3">
                        {!isEditing ? (
                          <>
                            {profile.profile.githubUrl && (
                              <a href={profile.profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                <Github className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-900">GitHub Profile</span>
                              </a>
                            )}
                            {profile.profile.linkedinUrl && (
                              <a href={profile.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                <Linkedin className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-900">LinkedIn Profile</span>
                              </a>
                            )}
                            {profile.profile.portfolioUrl && (
                              <a href={profile.profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                <Globe className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-900">Portfolio Website</span>
                              </a>
                            )}
                          </>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                              <input
                                type="url"
                                value={editForm.githubUrl || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="https://github.com/username"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                              <input
                                type="url"
                                value={editForm.linkedinUrl || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="https://linkedin.com/in/username"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                              <input
                                type="url"
                                value={editForm.portfolioUrl || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="https://yourportfolio.com"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Technical Skills</h3>
                    {isEditing && (
                      <button
                        onClick={addSkill}
                        className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Skill</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(isEditing ? editForm.skills : profile.profile.skills).map((skill, index) => (
                      <div key={index} className="relative group">
                        {!isEditing ? (
                          <div className="px-3 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200">
                            {skill}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => updateSkill(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Skill name"
                            />
                            <button
                              onClick={() => removeSkill(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                  <div className="space-y-4">
                    {profile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-gray-600 text-sm">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {profile.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <div className="mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;