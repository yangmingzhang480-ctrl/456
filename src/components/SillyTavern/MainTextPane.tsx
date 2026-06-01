export function MainTextPane({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  if (!text && !isStreaming) {
    return <div className="st-maintext-empty">等待天机回应…</div>;
  }
  return (
    <div className={`st-maintext ${isStreaming ? 'st-maintext--streaming' : 'st-maintext--static'}`}>
      {text}{isStreaming && <span className="streaming-cursor">▍</span>}
    </div>
  );
}
