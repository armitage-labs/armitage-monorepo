import { getServerSession } from "next-auth";
import Image from "next/image";
import { options } from "../api/auth/[...nextauth]/options";

const ProfilePage = async () => {
  const session = await getServerSession(options);

  return (
    <div>
      <h1>ProfilePage</h1>
      <div>
        {session?.user?.name ? <h2>Hello {session.user.name}!</h2> : null}
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            width={200}
            height={200}
            alt={`Profile Pic for ${session.user.name}`}
            priority={true}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ProfilePage;
