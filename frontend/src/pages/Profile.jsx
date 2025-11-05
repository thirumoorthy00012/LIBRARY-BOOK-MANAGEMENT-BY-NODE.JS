import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom max-w-2xl">
        <h1 className="section-title">Profile</h1>
        
        <div className="card p-8">
          <div className="flex items-center mb-8">
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?background=667eea&color=fff&name=' + user?.name}
              alt={user?.name}
              className="w-24 h-24 rounded-full mr-6"
            />
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="badge badge-primary mt-2">{user?.role}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" className="input" defaultValue={user?.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="input" defaultValue={user?.email} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="tel" className="input" defaultValue={user?.phone} />
            </div>
            <button className="btn btn-primary">Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
