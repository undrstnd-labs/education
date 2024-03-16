// TODO: Generate metadata for this page

export default function ClassroomPage({
  params,
}: {
  params: { classroomId: string };
}) {
  return (
    <div>
      <h1>Classroom {params.classroomId}</h1>
    </div>
  );
}
