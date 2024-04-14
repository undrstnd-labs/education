import { classroom } from "@/types/classroom";
import { supabaseFile } from "@/types/supabase";
import { supabase } from "@lib/supabase";
import { v4 as uuidv4 } from "uuid";

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

export const uploadFiles = async (
  files: File[],
  classroom: classroom
): Promise<[supabaseFile[], string[]]> => {
  const uploadedFiles: supabaseFile[] = [];
  const urls: string[] = [];

  const uploadPromises = files.map(async (file) => {
    const { data, error } = await supabase.storage
      .from("files")
      .upload(
        "/classrooms/" + classroom.name + "/" + uuidv4() + "/" + file.name,
        file
      );

    if (error) {
      throw error;
    }

    const uploadedFile: supabaseFile = {
      name: file.name,
      url: data.path,
      type: file.type,
      size: file.size,
    };

    uploadedFiles.push(uploadedFile);
    urls.push(data.path);
  });

  await Promise.all(uploadPromises);

  return [uploadedFiles, urls];
};

export const deleteFiles = async (filesUrl: string[]) => {
  await Promise.all(
    filesUrl.map(async (fileUrl) => {
      await supabase.storage.from("files").remove([fileUrl]);
    })
  );
};
