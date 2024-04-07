export default function ChatPage({ params }: { params: { chatId: string } }) {
  return (
    <div>
      <h1>Chat {params.chatId}</h1>
    </div>
  );
}
