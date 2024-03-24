export async function GET(req: Request, res: Response) {
  return new Response(
    JSON.stringify({
      status: "ok",
      page: "classrooms",
      uptime: process.uptime(),
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}