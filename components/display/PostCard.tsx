import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { post } from "@/types/classroom";
import Image from "next/image";
import FileCard from "../showcase/FileCard";

interface PostCardProps {
  post: post;
  userId: string;
}

const PostCard = ({ post, userId }: PostCardProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex gap-2 items-center">
              <Image
                src={post.teacher.user.image!}
                alt={post.teacher.user.name!}
                width={16}
                height={16}
                className="size-6"
              />
              <div className="flex flex-col ">
                <div className="text-sm">{post.teacher.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {post.teacher.user.email}
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription>{post.content}</CardDescription>
          {post.files && post.files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-0.5">
              {post.files.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>{/*TODO: Reaction section*/}</CardContent>
      </Card>
      <div>{/*TODO: Comment section */}</div>
    </div>
  );
};

export default PostCard;
