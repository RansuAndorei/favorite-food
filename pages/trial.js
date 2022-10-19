import { supabase } from "@/lib/supabase";

export default function Trial() {
  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "example@email.com",
      password: "example-password",
    });
  }
  return (
    <div>
      <button onClick={() => signInWithEmail()}>Login</button>
      <p>adasdsadasdsa</p>
    </div>
  );
}
