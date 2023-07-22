import { SignIn } from "@clerk/nextjs";

export const SignInPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-32">
      <SignIn />
    </div>
  );
};

export default SignIn;
