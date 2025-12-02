import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ProfileForm from "./ProfileForm"; 
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6 md:p-10 pt-32">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>
      
      <div className="bg-white p-8 shadow-sm rounded-2xl border border-gray-100 max-w-2xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          {/* --- FIX: Added Fallback Image --- */}
          <img 
            src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover" 
          />
          {/* --------------------------------- */}
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{session.user.name}</h2>
            <p className="text-gray-500">{session.user.email}</p>
            <span className="inline-block mt-2 text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full capitalize">
              {session.user.role} Account
            </span>
          </div>
        </div>

        {/* Client Component for Editing Address & Logout */}
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}