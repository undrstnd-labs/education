import { supabase } from "@lib/supabase";

export async function uploadAvatar(file: File, userId: string) {
  return await supabase.storage
    .from("avatar")
    .upload(userId + "/avatar.png", file);
}

export async function deleteAvatar(userId: string) {
  return await supabase.storage.from("avatar").remove([userId + "/avatar.png"]);
}

export async function getAvatarDownloadUrl(userId: string) {
  return await supabase.storage.from("avatars").list(userId);
}

export async function manageAvatar(file: File, userId: string) {
  if (
    await getAvatarDownloadUrl(userId).then(
      (res) => res.data && res.data.length > 0
    )
  ) {
    deleteAvatar(userId);
  }

  await uploadAvatar(file, userId);

  const { data, error } = await getAvatarDownloadUrl(userId);
  if (error) {
    throw error;
  }

  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL +
    "/storage/v1/object/public/avatar/" +
    userId +
    "/avatar.png"
  );
}
