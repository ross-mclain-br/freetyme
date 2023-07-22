import { SignUp } from "@clerk/nextjs";

export const SignUpPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-32">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
