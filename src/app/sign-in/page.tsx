import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

import SignInButton from "@/components/signInButton";

const SignInPage = async () => {
  const session = await getServerSession(options);

  if (session) {
    redirect("/profile");
  } else {
    return (
      <div>
        <h1>SignInPage</h1>

        <SignInButton />
      </div>
    );
  }
};

export default SignInPage;
