"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isUserAdmin } from "@/lib/admin";

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !url || serviceRoleKey.includes("placeholder")) {
    return null;
  }
  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function login(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const isFromAdmin = formData.get("isFromAdmin") === "true";

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        const adminClient = getAdminClient();
        if (adminClient) {
          const { data: usersData } = await adminClient.auth.admin.listUsers();
          const targetUser = usersData?.users?.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase()
          );
          if (targetUser) {
            await adminClient.auth.admin.updateUserById(targetUser.id, {
              email_confirm: true,
            });
            const { data: retryData, error: retryError } =
              await supabase.auth.signInWithPassword({
                email,
                password,
              });

            if (!retryError && retryData) {
              revalidatePath("/", "layout");
              revalidatePath("/admin", "layout");
              if (isFromAdmin || isUserAdmin(retryData.user)) redirect("/admin");
              else redirect("/");
            }
          }
        }
      }
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    const userIsAdmin = isUserAdmin(data.user);

    if (isFromAdmin) {
      if (!userIsAdmin) {
        await supabase.auth.signOut();
        return {
          error:
            "Access Denied: Only authorized administrators (e.g. lasaljayasinghe331@gmail.com) have access to the admin console.",
        };
      }
      redirect("/admin");
    }

    if (userIsAdmin) {
      redirect("/admin");
    } else {
      redirect("/");
    }
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    return {
      error:
        "Unable to connect to Supabase database. Please ensure your real Supabase URL and keys are set in .env.local.",
    };
  }
}

export async function signup(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!firstName || !email || !password) {
    return { error: "Please fill in all fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    const adminClient = getAdminClient();

    if (adminClient) {
      const { error: adminError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          full_name: firstName,
        },
      });

      if (adminError) {
        if (
          adminError.message.includes("already registered") ||
          adminError.message.includes("already exists")
        ) {
          return {
            error:
              "User already registered with this email. Please sign in instead.",
          };
        }
        return { error: adminError.message };
      }
    } else {
      const supabase = await createClient();
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            full_name: firstName,
          },
        },
      });

      if (signupError) {
        return { error: signupError.message };
      }
    }

    const supabase = await createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return {
        success:
          "Account created successfully! You can now log in with your email and password.",
      };
    }

    revalidatePath("/", "layout");
    redirect("/");
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    return {
      error:
        "Registration failed. Please check your network connection and try again.",
    };
  }
}

export async function logout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    // Ignore signout fetch errors
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
